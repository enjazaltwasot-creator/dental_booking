import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, time, date, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Dental services table
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  duration: int("duration").notNull(), // duration in minutes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Dentists table
 */
export const dentists = mysqlTable("dentists", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  bio: text("bio"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dentist = typeof dentists.$inferSelect;
export type InsertDentist = typeof dentists.$inferInsert;

/**
 * Working hours for dentists
 */
export const workingHours = mysqlTable("working_hours", {
  id: int("id").autoincrement().primaryKey(),
  dentistId: int("dentist_id").notNull(),
  dayOfWeek: int("day_of_week").notNull(), // 0 = Sunday, 6 = Saturday
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WorkingHour = typeof workingHours.$inferSelect;
export type InsertWorkingHour = typeof workingHours.$inferInsert;

/**
 * Bookings table
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  referenceNumber: varchar("reference_number", { length: 20 }).notNull().unique(),
  dentistId: int("dentist_id").notNull(),
  serviceId: int("service_id").notNull(),
  patientName: varchar("patient_name", { length: 100 }).notNull(),
  patientPhone: varchar("patient_phone", { length: 20 }).notNull(),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: time("appointment_time").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
