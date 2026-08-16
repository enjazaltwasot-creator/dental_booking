import { describe, expect, it } from "vitest";
import { buildBookingReminderSchedule } from "./db";

describe("booking reminder schedule", () => {
  it("creates the immediate, 48-hour, and 24-hour reminder slots", () => {
    const createdAt = new Date("2026-12-01T09:15:00.000Z");
    const schedule = buildBookingReminderSchedule({
      appointmentDate: new Date("2026-12-10T00:00:00.000Z"),
      appointmentTime: "10:00:00",
    }, createdAt);

    expect(schedule).toEqual([
      { reminderType: "booking_created", scheduledFor: createdAt },
      { reminderType: "before_48h", scheduledFor: new Date("2026-12-08T07:00:00.000Z") },
      { reminderType: "before_24h", scheduledFor: new Date("2026-12-09T07:00:00.000Z") },
    ]);
  });
});
