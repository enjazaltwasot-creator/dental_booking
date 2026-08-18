import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, time, date, boolean, uniqueIndex, datetime, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  username: varchar("username", { length: 100 }).unique(),
  password: text("password"),
  isActive: boolean("is_active").default(true).notNull(),

  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  adminPermission: mysqlEnum("admin_permission", ["full_access", "operations", "bookings"]).default("full_access").notNull(),
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
  department: mysqlEnum("department", ["dentistry", "dermatology", "laser"]).default("dentistry").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/** Branches are managed from the admin panel; pausing preserves historical bookings. */
export const branches = mysqlTable("branches", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 140 }).notNull(),
  shortName: varchar("short_name", { length: 100 }).notNull(),
  city: varchar("city", { length: 140 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type BranchRecord = typeof branches.$inferSelect;

/** Per-branch availability for the three declared clinical departments. */
export const branchSpecialties = mysqlTable("branch_specialties", {
  id: int("id").autoincrement().primaryKey(),
  branchId: int("branch_id").notNull(),
  department: mysqlEnum("department", ["dentistry", "dermatology", "laser"]).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("branch_specialties_branch_department_unique").on(table.branchId, table.department)]);
export type BranchSpecialty = typeof branchSpecialties.$inferSelect;

/**
 * Dentists table
 */
export const dentists = mysqlTable("dentists", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  department: mysqlEnum("department", ["dentistry", "dermatology", "laser"]).default("dentistry").notNull(),
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
  branch: varchar("branch", { length: 64 }),
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

/**
 * Delivery queue for booking reminders. Messages stay pending until an approved
 * provider (WhatsApp Business API) is connected.
 */
export const bookingReminders = mysqlTable("booking_reminders", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("booking_id").notNull(),
  reminderType: mysqlEnum("reminder_type", ["booking_created", "before_48h", "before_24h"]).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "skipped", "failed"]).default("pending").notNull(),
  scheduledFor: datetime("scheduled_for", { mode: "date" }).notNull(),
  processedAt: timestamp("processed_at"),
  providerReference: varchar("provider_reference", { length: 160 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("booking_reminders_booking_type_unique").on(table.bookingId, table.reminderType),
]);

export type BookingReminder = typeof bookingReminders.$inferSelect;
export type InsertBookingReminder = typeof bookingReminders.$inferInsert;

/** Pseudonymous website or messaging-channel sessions for Evan Assistant. */
export const assistantConversations = mysqlTable("assistant_conversations", {
  id: int("id").autoincrement().primaryKey(),
  sessionKey: varchar("session_key", { length: 64 }).notNull(),
  channel: mysqlEnum("channel", ["website", "whatsapp"]).default("website").notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("assistant_conversations_session_key_unique").on(table.sessionKey),
  index("assistant_conversations_last_message_at_index").on(table.lastMessageAt),
]);

export type AssistantConversation = typeof assistantConversations.$inferSelect;

/** Immutable message rows; no direct identifiers are captured by this model. */
export const assistantMessages = mysqlTable("assistant_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversation_id").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  index("assistant_messages_conversation_created_index").on(table.conversationId, table.createdAt),
]);

export type AssistantMessage = typeof assistantMessages.$inferSelect;

/** Outbox pattern for CRM synchronization; delivery remains disabled until configured. */
export const crmSyncEvents = mysqlTable("crm_sync_events", {
  id: int("id").autoincrement().primaryKey(),
  eventType: mysqlEnum("event_type", ["booking_created", "assistant_conversation"]).notNull(),
  resourceReference: varchar("resource_reference", { length: 80 }).notNull(),
  payload: text("payload").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  attemptCount: int("attempt_count").default(0).notNull(),
  lastAttemptAt: timestamp("last_attempt_at"),
  providerReference: varchar("provider_reference", { length: 160 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("crm_sync_events_resource_type_unique").on(table.resourceReference, table.eventType),
]);

export type CrmSyncEvent = typeof crmSyncEvents.$inferSelect;

/** Idempotent action inbox for future WhatsApp interactive-message replies. */
export const bookingActionRequests = mysqlTable("booking_action_requests", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("booking_id").notNull(),
  action: mysqlEnum("action", ["confirm", "reschedule", "cancel"]).notNull(),
  source: mysqlEnum("source", ["whatsapp", "website"]).notNull(),
  externalMessageId: varchar("external_message_id", { length: 160 }).notNull(),
  status: mysqlEnum("status", ["pending", "processed", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("booking_action_requests_message_unique").on(table.externalMessageId),
]);

export type BookingActionRequest = typeof bookingActionRequests.$inferSelect;
