import { asc, desc, eq, and, gte, lte, ne, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, services, branches, branchSpecialties, dentists, dentistBranches, dentistServices, workingHours, bookings, bookingReminders, whatsappMessageEvents, crmSyncEvents, bookingActionRequests, bookingAdminActions, assistantConversations, assistantMessages, AssistantConversation, AssistantMessage, Booking, BookingActionRequest, BookingReminder, WhatsAppMessageEvent, CrmSyncEvent, Service, Dentist, WorkingHour, User, BranchRecord, BranchSpecialty, DentistBranch, DentistService } from "../drizzle/schema";
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

export async function createAdminUser(input: { username: string; password: string; name?: string; permission?: "full_access" | "operations" | "bookings" }) {
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
    adminPermission: input.permission ?? "bookings",
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

export async function countActiveFullAccessAdmins() {
  const accounts = await listAdminUsers();
  return accounts.filter(account => account.isActive && account.adminPermission === "full_access").length;
}

export async function setAdminUserPermission(username: string, adminPermission: "full_access" | "operations" | "bookings") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ adminPermission }).where(and(eq(users.username, username), eq(users.role, "admin")));
  return getAdminUserByUsername(username);
}

// Dental services queries
export async function getAllServices(): Promise<Service[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(services).where(eq(services.isActive, true));
  } catch (error) {
    console.error("[Database] Failed to list active services:", error);
    if (error && typeof error === "object" && "cause" in error) {
      console.error("[Database] Active services query cause:", (error as { cause?: unknown }).cause);
    }
    throw error;
  }
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

export async function deleteServiceIfUnused(id: number): Promise<"deleted" | "in_use" | "not_found"> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const service = await getServiceById(id);
  if (!service) return "not_found";
  const linkedBookings = await db.select({ id: bookings.id }).from(bookings).where(eq(bookings.serviceId, id)).limit(1);
  if (linkedBookings.length) return "in_use";
  await db.delete(services).where(eq(services.id, id));
  return "deleted";
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

export async function deleteBranchIfUnused(id: number): Promise<"deleted" | "in_use" | "not_found"> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const branch = (await db.select().from(branches).where(eq(branches.id, id)).limit(1))[0];
  if (!branch) return "not_found";
  const linkedBookings = await db.select({ id: bookings.id }).from(bookings).where(eq(bookings.branch, branch.slug)).limit(1);
  if (linkedBookings.length) return "in_use";
  await db.delete(branchSpecialties).where(eq(branchSpecialties.branchId, id));
  await db.delete(branches).where(eq(branches.id, id));
  return "deleted";
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
export async function getActiveBranchesForDepartment(department: "dentistry" | "dermatology" | "laser"): Promise<BranchRecord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: branches.id,
    slug: branches.slug,
    name: branches.name,
    shortName: branches.shortName,
    city: branches.city,
    address: branches.address,
    phone: branches.phone,
    isActive: branches.isActive,
    createdAt: branches.createdAt,
    updatedAt: branches.updatedAt,
  }).from(branches).innerJoin(branchSpecialties, and(
    eq(branchSpecialties.branchId, branches.id),
    eq(branchSpecialties.department, department),
    eq(branchSpecialties.isActive, true)
  )).where(eq(branches.isActive, true));
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
export type CareDepartment = "dentistry" | "dermatology" | "laser";
export type BookingSource = "snapchat" | "instagram" | "facebook" | "branch_visit" | "other";

export async function getAllDentists(): Promise<Dentist[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dentists).orderBy(asc(dentists.name));
}

export async function getActiveDentists(): Promise<Dentist[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dentists).where(eq(dentists.isActive, true)).orderBy(asc(dentists.name));
}

export async function getDentistsForDepartment(department: CareDepartment): Promise<Dentist[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dentists).where(and(eq(dentists.department, department), eq(dentists.isActive, true))).orderBy(asc(dentists.name));
}

export async function getDentistById(id: number): Promise<Dentist | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(dentists).where(eq(dentists.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDentist(input: { name: string; specialization: string; department: CareDepartment; bio?: string; phone?: string; email?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(dentists).values({ ...input, isActive: true });
  return getDentistById(Number(result[0].insertId));
}

export async function updateDentist(id: number, input: { name: string; specialization: string; department: CareDepartment; bio?: string; phone?: string; email?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(dentists).set(input).where(eq(dentists.id, id));
  return getDentistById(id);
}

export async function setDentistActive(id: number, isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(dentists).set({ isActive }).where(eq(dentists.id, id));
  return getDentistById(id);
}

export async function deleteDentistIfUnused(id: number): Promise<"deleted" | "in_use" | "not_found"> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const dentist = await getDentistById(id);
  if (!dentist) return "not_found";
  const linkedBookings = await db.select({ id: bookings.id }).from(bookings).where(eq(bookings.dentistId, id)).limit(1);
  if (linkedBookings.length) return "in_use";
  await db.delete(dentistBranches).where(eq(dentistBranches.dentistId, id));
  await db.delete(dentistServices).where(eq(dentistServices.dentistId, id));
  await db.delete(workingHours).where(eq(workingHours.dentistId, id));
  await db.delete(dentists).where(eq(dentists.id, id));
  return "deleted";
}

export async function getDentistBranches(dentistId: number): Promise<DentistBranch[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dentistBranches).where(eq(dentistBranches.dentistId, dentistId));
}

export async function getDentistServices(dentistId: number): Promise<DentistService[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dentistServices).where(eq(dentistServices.dentistId, dentistId));
}

export async function setDentistAssignments(dentistId: number, branchIds: number[], serviceIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(dentistBranches).where(eq(dentistBranches.dentistId, dentistId));
  await db.delete(dentistServices).where(eq(dentistServices.dentistId, dentistId));
  if (branchIds.length) await db.insert(dentistBranches).values(branchIds.map(branchId => ({ dentistId, branchId, isActive: true })));
  if (serviceIds.length) await db.insert(dentistServices).values(serviceIds.map(serviceId => ({ dentistId, serviceId, isActive: true })));
  return { branches: await getDentistBranches(dentistId), services: await getDentistServices(dentistId) };
}

export async function getWorkingHoursForDentist(dentistId: number): Promise<WorkingHour[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workingHours).where(eq(workingHours.dentistId, dentistId)).orderBy(asc(workingHours.dayOfWeek), asc(workingHours.startTime));
}

export async function setWorkingHoursForDentist(dentistId: number, hours: Array<{ dayOfWeek: number; startTime: string; endTime: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(workingHours).where(eq(workingHours.dentistId, dentistId));
  if (hours.length) await db.insert(workingHours).values(hours.map(hour => ({ ...hour, dentistId, isActive: true })));
  return getWorkingHoursForDentist(dentistId);
}

export async function getDentistsForBranchAndService(branchSlug: string, serviceId: number): Promise<Dentist[]> {
  const db = await getDb();
  if (!db) return [];
  const branch = await getBranchBySlug(branchSlug);
  if (!branch?.isActive) return [];
  const assigned = await db.select({ dentistId: dentistBranches.dentistId })
    .from(dentistBranches)
    .innerJoin(dentistServices, and(eq(dentistServices.dentistId, dentistBranches.dentistId), eq(dentistServices.serviceId, serviceId), eq(dentistServices.isActive, true)))
    .where(and(eq(dentistBranches.branchId, branch.id), eq(dentistBranches.isActive, true)));
  const dentistIds = Array.from(new Set(assigned.map(item => item.dentistId)));
  if (!dentistIds.length) return [];
  return db.select().from(dentists).where(and(inArray(dentists.id, dentistIds), eq(dentists.isActive, true))).orderBy(asc(dentists.name));
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
  bookingSource: BookingSource;
  whatsappBookingConsent: boolean;
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
    bookingSource: booking.bookingSource,
    whatsappBookingConsent: booking.whatsappBookingConsent,
    slotState: "reserved",
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

export type WhatsAppMessageStatus = "queued" | "sending" | "accepted" | "delivered" | "read" | "failed" | "skipped";

export async function queueWhatsAppMessageEvent(input: {
  bookingId: number;
  templateName: string;
  recipientFingerprint: string;
}): Promise<WhatsAppMessageEvent> {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  await database.insert(whatsappMessageEvents).values({
    bookingId: input.bookingId,
    templateName: input.templateName,
    recipientFingerprint: input.recipientFingerprint,
    status: "queued",
  }).onDuplicateKeyUpdate({ set: { templateName: input.templateName } });

  const event = (await database.select().from(whatsappMessageEvents).where(
    and(eq(whatsappMessageEvents.bookingId, input.bookingId), eq(whatsappMessageEvents.templateName, input.templateName))
  ).limit(1))[0];
  if (!event) throw new Error("Failed to queue WhatsApp message event");
  return event;
}

export async function claimQueuedWhatsAppMessageEvent(eventId: number): Promise<boolean> {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  const result = await database.update(whatsappMessageEvents).set({
    status: "sending",
    attemptCount: sql`${whatsappMessageEvents.attemptCount} + 1`,
    lastAttemptAt: new Date(),
    errorCode: null,
  }).where(and(eq(whatsappMessageEvents.id, eventId), eq(whatsappMessageEvents.status, "queued")));

  return Number(result[0]?.affectedRows ?? 0) === 1;
}

export async function updateWhatsAppMessageEvent(input: {
  eventId: number;
  status: WhatsAppMessageStatus;
  providerMessageId?: string | null;
  errorCode?: string | null;
  providerUpdatedAt?: Date | null;
}): Promise<void> {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  await database.update(whatsappMessageEvents).set({
    status: input.status,
    providerMessageId: input.providerMessageId,
    errorCode: input.errorCode,
    providerUpdatedAt: input.providerUpdatedAt,
  }).where(eq(whatsappMessageEvents.id, input.eventId));
}

export async function updateWhatsAppMessageDeliveryStatus(input: {
  providerMessageId: string;
  status: Extract<WhatsAppMessageStatus, "delivered" | "read" | "failed">;
  errorCode?: string | null;
  providerUpdatedAt?: Date;
}): Promise<void> {
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  await database.update(whatsappMessageEvents).set({
    status: input.status,
    errorCode: input.errorCode ?? null,
    providerUpdatedAt: input.providerUpdatedAt ?? new Date(),
  }).where(eq(whatsappMessageEvents.providerMessageId, input.providerMessageId));
}

export async function getWhatsAppMessageEvents(bookingId: number): Promise<WhatsAppMessageEvent[]> {
  const database = await getDb();
  if (!database) return [];
  return database.select().from(whatsappMessageEvents).where(eq(whatsappMessageEvents.bookingId, bookingId)).orderBy(desc(whatsappMessageEvents.createdAt));
}

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

export async function queueWebsiteBookingActionRequest(input: {
  bookingId: number;
  referenceNumber: string;
  action: "reschedule" | "cancel";
}): Promise<BookingActionRequest> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const externalMessageId = `website:${input.referenceNumber}:${input.action}:${Date.now()}`;
  await db.insert(bookingActionRequests).values({
    bookingId: input.bookingId,
    action: input.action,
    source: "website",
    externalMessageId,
    status: "pending",
  });
  const requests = await getBookingActionRequests(input.bookingId);
  const request = requests.find(item => item.externalMessageId === externalMessageId);
  if (!request) throw new Error("Could not record booking action request");
  return request;
}

export async function getBookingActionRequests(bookingId: number): Promise<BookingActionRequest[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookingActionRequests).where(eq(bookingActionRequests.bookingId, bookingId));
}

export async function listBookingActionRequests(): Promise<BookingActionRequest[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookingActionRequests).orderBy(desc(bookingActionRequests.createdAt));
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
  
  await db.update(bookings).set({ status, slotState: status === "cancelled" ? null : "reserved" }).where(eq(bookings.referenceNumber, referenceNumber));
  
  const result = await db.select().from(bookings).where(eq(bookings.referenceNumber, referenceNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function rescheduleBookingByAdmin(input: { referenceNumber: string; branch: string; dentistId: number; serviceId: number; appointmentDate: Date; appointmentTime: string; performedBy: string }): Promise<Booking | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const booking = await getBookingByReferenceNumber(input.referenceNumber);
  if (!booking) return undefined;
  const beforePayload = JSON.stringify({ branch: booking.branch, dentistId: booking.dentistId, serviceId: booking.serviceId, appointmentDate: booking.appointmentDate, appointmentTime: booking.appointmentTime, status: booking.status });
  await db.update(bookings).set({
    branch: input.branch,
    dentistId: input.dentistId,
    serviceId: input.serviceId,
    appointmentDate: input.appointmentDate,
    appointmentTime: input.appointmentTime,
    status: "pending",
    slotState: "reserved",
  }).where(eq(bookings.referenceNumber, input.referenceNumber));
  const updated = await getBookingByReferenceNumber(input.referenceNumber);
  await db.insert(bookingAdminActions).values({
    bookingId: booking.id,
    referenceNumber: booking.referenceNumber,
    action: "rescheduled",
    performedBy: input.performedBy,
    beforePayload,
    afterPayload: JSON.stringify({ branch: input.branch, dentistId: input.dentistId, serviceId: input.serviceId, appointmentDate: input.appointmentDate, appointmentTime: input.appointmentTime }),
  });
  return updated;
}

export async function deleteBookingByAdmin(referenceNumber: string, performedBy: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const booking = await getBookingByReferenceNumber(referenceNumber);
  if (!booking) return false;
  await db.insert(bookingAdminActions).values({
    bookingId: booking.id,
    referenceNumber: booking.referenceNumber,
    action: "deleted",
    performedBy,
    beforePayload: JSON.stringify(booking),
    afterPayload: null,
  });
  await db.delete(bookingActionRequests).where(eq(bookingActionRequests.bookingId, booking.id));
  await db.delete(bookingReminders).where(eq(bookingReminders.bookingId, booking.id));
  await db.delete(bookings).where(eq(bookings.id, booking.id));
  return true;
}

export async function getBookingById(id: number): Promise<Booking | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
