import { eq, and, gte, lte, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, services, dentists, workingHours, bookings, Booking, Service, Dentist, WorkingHour } from "../drizzle/schema";
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

// Dental services queries
export async function getAllServices(): Promise<Service[]> {
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
  return db.select().from(bookings);
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
