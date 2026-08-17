import { asc, desc, eq, and, gte, lte, ne, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, services, branches, branchSpecialties, dentists, workingHours, bookings, bookingReminders, crmSyncEvents, bookingActionRequests, assistantConversations, assistantMessages, AssistantConversation, AssistantMessage, Booking, BookingActionRequest, BookingReminder, CrmSyncEvent, Service, Dentist, WorkingHour, User, BranchRecord, BranchSpecialty } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAdminUserByUsername(username: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(and(eq(users.username, username), eq(users.role, "admin"))).limit(1);
  return result[0];
}

export async function listAdminUsers(): Promise<User[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.role, "admin")).orderBy(desc(users.createdAt));
}

export async function createAdminUser(input: { username: string; password: string; name?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(users).values({
    openId: `local:${input.username}`,
    username: input.username,
    password: input.password,
    name: input.name ?? input.username,
    loginMethod: "local-admin",
    role: "admin",
    isActive: true,
    lastSignedIn: new Date(),
  });
  return getAdminUserByUsername(input.username);
}

export async function updateAdminUser(username: string, input: { name?: string; password?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const account = await getAdminUserByUsername(username);
  if (!account) return undefined;
  await db.update(users).set({
    name: input.name === undefined ? account.name : input.name,
    password: input.password ?? account.password,
  }).where(and(eq(users.username, username), eq(users.role, "admin")));
  return getAdminUserByUsername(username);
}

export async function setAdminUserActive(username: string, isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ isActive }).where(and(eq(users.username, username), eq(users.role, "admin")));
  return getAdminUserByUsername(username);
}

export async function deleteAdminUser(username: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(users).where(and(eq(users.username, username), eq(users.role, "admin")));
}

export async function countActiveAdminUsers() {
  const accounts = await listAdminUsers();
  return accounts.filter(account => account.isActive).length;
}

// Dental services queries
export async function getAllServices(): Promise<Service[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).where(eq(services.isActive, true));
}

export async function getAllServicesForAdmin(): Promise<Service[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services);
}

export async function getServiceById(id: number): Promise<Service | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createService(input: { name: string; description?: string; duration: number; department: "dentistry" | "dermatology" | "laser"; isActive?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(services).values({
    name: input.name,
    description: input.description,
    duration: input.duration,
    department: input.department,
    isActive: input.isActive ?? true,
  });
  const created = await db.select().from(services).where(eq(services.id, Number(result[0].insertId))).limit(1);
  return created[0];
}

export async function updateService(id: number, input: { name: string; description?: string; duration: number; department: "dentistry" | "dermatology" | "laser" }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(services).set(input).where(eq(services.id, id));
  return getServiceById(id);
}

export async function setServiceActive(id: number, isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(services).set({ isActive }).where(eq(services.id, id));
  return getServiceById(id);
}

export async function getAllBranches(): Promise<BranchRecord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(branches).orderBy(asc(branches.id));
}
export async function getActiveBranches(): Promise<BranchRecord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(branches).where(eq(branches.isActive, true)).orderBy(asc(branches.id));
}
export async function getBranchBySlug(slug: string): Promise<BranchRecord | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  return (await db.select().from(branches).where(eq(branches.slug, slug)).limit(1))[0];
}
export async function createBranch(input: { slug: string; name: string; shortName: string; city: string; address?: string; phone?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(branches).values({ ...input, isActive: true });
  const branchId = Number(result[0].insertId);
  await db.insert(branchSpecialties).values((["dentistry", "dermatology", "laser"] as const).map(department => ({ branchId, department, isActive: true })));
  return (await db.select().from(branches).where(eq(branches.id, branchId)).limit(1))[0];
}
export async function updateBranch(id: number, input: { name: string; shortName: string; city: string; address?: string; phone?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(branches).set(input).where(eq(branches.id, id));
  return (await db.select().from(branches).where(eq(branches.id, id)).limit(1))[0];
}
export async function setBranchActive(id: number, isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(branches).set({ isActive }).where(eq(branches.id, id));
  return (await db.select().from(branches).where(eq(branches.id, id)).limit(1))[0];
}
export async function getAllBranchSpecialties(): Promise<BranchSpecialty[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(branchSpecialties).orderBy(asc(branchSpecialties.branchId));
}
export async function getBranchSpecialties(branchId: number): Promise<BranchSpecialty[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(branchSpecialties).where(eq(branchSpecialties.branchId, branchId));
}
export async function setBranchSpecialtyActive(branchId: number, department: "dentistry" | "dermatology" | "laser", isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(branchSpecialties).set({ isActive }).where(and(eq(branchSpecialties.branchId, branchId), eq(branchSpecialties.department, department)));
  return getBranchSpecialties(branchId);
}
export async function getServicesForBranch(slug: string): Promise<Service[]> {
  const db = await getDb();
  if (!db) return [];
  const branch = await getBranchBySlug(slug);
  if (!branch?.isActive) return [];
  const activeDepartments = (await getBranchSpecialties(branch.id)).filter(item => item.isActive).map(item => item.department);
  if (!activeDepartments.length) return [];
  return db.select().from(services).where(and(eq(services.isActive, true), inArray(services.department, activeDepartments)));
}

// Dentists queries
export async function getAllDentists(): Promise<Dentist[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dentists);
}

export async function getDentistById(id: number): Promise<Dentist | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(dentists).where(eq(dentists.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Working hours queries
export async function getWorkingHoursByDentistAndDay(dentistId: number, dayOfWeek: number): Promise<WorkingHour[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workingHours).where(
    and(eq(workingHours.dentistId, dentistId), eq(workingHours.dayOfWeek, dayOfWeek), eq(workingHours.isActive, true))
  );
}

// Bookings queries
export async function createBooking(booking: {
  referenceNumber: string;
  branch: string;
  dentistId: number;
  serviceId: number;
  patientName: string;
  patientPhone: string;
  appointmentDate: Date;
  appointmentTime: string;
  notes?: string;
}): Promise<Booking> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(bookings).values({
    referenceNumber: booking.referenceNumber,
    branch: booking.branch,
    dentistId: booking.dentistId,
    serviceId: booking.serviceId,
    patientName: booking.patientName,
    patientPhone: booking.patientPhone,
    appointmentDate: booking.appointmentDate,
    appointmentTime: booking.appointmentTime,
    status: 'pending',
    notes: booking.notes,
  });
  
  const newBooking = await db.select().from(bookings).where(eq(bookings.referenceNumber, booking.referenceNumber)).limit(1);
  if (!newBooking.length) throw new Error("Failed to create booking");
  return newBooking[0];
}

export async function getBookingByReferenceNumber(referenceNumber: string): Promise<Booking | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bookings).where(eq(bookings.referenceNumber, referenceNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllBookings(): Promise<Booking[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export type BookingReminderType = "booking_created" | "before_48h" | "before_24h";

function toAppointmentStart(date: Date, timeValue: string): Date {
  const datePart = date.toISOString().slice(0, 10);
  const timePart = String(timeValue).slice(0, 5).padEnd(5, "0");
  return new Date(`${datePart}T${timePart}:00+03:00`);
}

export function buildBookingReminderSchedule(
  booking: Pick<Booking, "appointmentDate" | "appointmentTime">,
  createdAt = new Date()
): Array<{ reminderType: BookingReminderType; scheduledFor: Date }> {
  const appointmentStart = toAppointmentStart(booking.appointmentDate, String(booking.appointmentTime));
  return [
    { reminderType: "booking_created", scheduledFor: createdAt },
    { reminderType: "before_48h", scheduledFor: new Date(appointmentStart.getTime() - 48 * 60 * 60 * 1000) },
    { reminderType: "before_24h", scheduledFor: new Date(appointmentStart.getTime() - 24 * 60 * 60 * 1000) },
  ];
}

export async function createBookingReminderQueue(booking: Booking): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const reminderTimes = buildBookingReminderSchedule(booking);

  for (const reminder of reminderTimes) {
    if (reminder.reminderType !== "booking_created" && reminder.scheduledFor.getTime() <= Date.now()) {
      continue;
    }
    await db.insert(bookingReminders).values({
      bookingId: booking.id,
      reminderType: reminder.reminderType,
      scheduledFor: reminder.scheduledFor,
      status: "pending",
    }).onDuplicateKeyUpdate({ set: { scheduledFor: reminder.scheduledFor } });
  }
}

export async function getBookingReminders(bookingId: number): Promise<BookingReminder[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookingReminders).where(eq(bookingReminders.bookingId, bookingId));
}

export type AssistantConversationMessageInput = {
  role: "user" | "assistant";
  content: string;
};

export async function recordAssistantConversation(input: {
  sessionKey: string;
  messages: AssistantConversationMessageInput[];
}): Promise<AssistantConversation> {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  const lastMessageAt = new Date();
  await database.insert(assistantConversations).values({
    sessionKey: input.sessionKey,
    channel: "website",
    lastMessageAt,
  }).onDuplicateKeyUpdate({ set: { lastMessageAt } });

  const conversation = (await database.select().from(assistantConversations)
    .where(eq(assistantConversations.sessionKey, input.sessionKey)).limit(1))[0];
  if (!conversation) throw new Error("Failed to create assistant conversation");

  await database.insert(assistantMessages).values(input.messages.map(message => ({
    conversationId: conversation.id,
    role: message.role,
    content: message.content,
  })));

  const messages = await getAssistantMessages(conversation.id);
  const payload = JSON.stringify({
    channel: conversation.channel,
    conversationId: conversation.id,
    sessionKey: conversation.sessionKey,
    lastMessageAt: lastMessageAt.toISOString(),
    messages: messages.map(message => ({
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    })),
  });

  await database.insert(crmSyncEvents).values({
    eventType: "assistant_conversation",
    resourceReference: `assistant:${conversation.id}`,
    payload,
    status: "pending",
  }).onDuplicateKeyUpdate({ set: { payload, status: "pending" } });

  return conversation;
}

export async function listAssistantConversations(limit = 50): Promise<AssistantConversation[]> {
  const database = await getDb();
  if (!database) return [];
  return database.select().from(assistantConversations)
    .orderBy(desc(assistantConversations.lastMessageAt)).limit(limit);
}

export async function getAssistantMessages(conversationId: number): Promise<AssistantMessage[]> {
  const database = await getDb();
  if (!database) return [];
  return database.select().from(assistantMessages)
    .where(eq(assistantMessages.conversationId, conversationId))
    .orderBy(asc(assistantMessages.createdAt));
}

export async function queueCrmBookingCreatedEvent(booking: Booking): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const payload = JSON.stringify({
    referenceNumber: booking.referenceNumber,
    branch: booking.branch,
    patientName: booking.patientName,
    patientPhone: booking.patientPhone,
    appointmentDate: booking.appointmentDate.toISOString(),
    appointmentTime: String(booking.appointmentTime),
    status: booking.status,
  });

  await db.insert(crmSyncEvents).values({
    eventType: "booking_created",
    resourceReference: booking.referenceNumber,
    payload,
    status: "pending",
  }).onDuplicateKeyUpdate({ set: { payload, status: "pending" } });
}

export async function getCrmSyncEvents(resourceReference: string): Promise<CrmSyncEvent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmSyncEvents).where(eq(crmSyncEvents.resourceReference, resourceReference));
}

export async function queueBookingActionRequest(input: {
  bookingId: number;
  action: "confirm" | "reschedule" | "cancel";
  externalMessageId: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bookingActionRequests).values({
    bookingId: input.bookingId,
    action: input.action,
    source: "whatsapp",
    externalMessageId: input.externalMessageId,
    status: "pending",
  }).onDuplicateKeyUpdate({ set: { externalMessageId: input.externalMessageId } });
}

export async function getBookingActionRequests(bookingId: number): Promise<BookingActionRequest[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookingActionRequests).where(eq(bookingActionRequests.bookingId, bookingId));
}

export async function getBookingsByDentistAndDate(dentistId: number, appointmentDate: Date): Promise<Booking[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(
    and(
      eq(bookings.dentistId, dentistId),
      eq(bookings.appointmentDate, appointmentDate),
      ne(bookings.status, 'cancelled')
    )
  );
}

export async function updateBookingStatus(referenceNumber: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<Booking | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(bookings).set({ status }).where(eq(bookings.referenceNumber, referenceNumber));
  
  const result = await db.select().from(bookings).where(eq(bookings.referenceNumber, referenceNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBookingById(id: number): Promise<Booking | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
