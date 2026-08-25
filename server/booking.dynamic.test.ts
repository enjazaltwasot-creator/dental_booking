import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schemaSource = readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const bookingSource = readFileSync(new URL("../client/src/pages/BookingForm.tsx", import.meta.url), "utf8");
const adminSource = readFileSync(new URL("../client/src/pages/AdminDashboard.tsx", import.meta.url), "utf8");

describe("dynamic booking workflow", () => {
  it("keeps the physician slot unique and records a booking source", () => {
    expect(schemaSource).toContain('uniqueIndex("bookings_dentist_date_time_reserved_unique")');
    expect(schemaSource).toContain('bookingSource: mysqlEnum("booking_source"');
    expect(routerSource).toContain('bookingSource: bookingSourceSchema.default("other")');
    expect(routerSource).toContain('ER_DUP_ENTRY');
  });

  it("starts with the branch and filters doctors by both branch and service", () => {
    expect(bookingSource).toContain('const STEPS = ["الفرع", "نوع الرعاية"');
    expect(bookingSource).toContain('trpc.dentists.listForBranchAndService.useQuery');
    expect(bookingSource).toContain('trpc.workingHours.recommendAvailable.useQuery');
    expect(bookingSource).toContain('BOOKING_SOURCES');
  });

  it("exposes rescheduling and deletion only through the full-access admin experience", () => {
    expect(routerSource).toContain('reschedule: fullAccessProcedure');
    expect(routerSource).toContain('remove: fullAccessProcedure');
    expect(adminSource).toContain('const canManageBookings = permission === "full_access"');
    expect(adminSource).toContain('صلاحيات المدير العام');
  });
});
