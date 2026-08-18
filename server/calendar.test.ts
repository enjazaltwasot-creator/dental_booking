import { describe, expect, it } from "vitest";
import { buildCalendarEvent } from "../client/src/lib/calendar";

describe("calendar appointment export", () => {
  it("builds Google and ICS calendar payloads from the booking details", () => {
    const event = buildCalendarEvent({
      referenceNumber: "DENTAL-TEST01",
      appointmentDate: "2026-09-14",
      appointmentTime: "16:00:00",
      serviceName: "زراعة الأسنان",
      dentistName: "د. أحمد محمود",
      branchName: "فرع حي المهدية",
    });

    expect(event.googleUrl).toContain("calendar.google.com");
    expect(event.googleUrl).toContain("ctz=Asia%2FRiyadh");
    expect(event.icsContent).toContain("DTSTART;TZID=Asia/Riyadh:20260914T160000");
    expect(event.icsContent).toContain("DTEND;TZID=Asia/Riyadh:20260914T163000");
    expect(event.icsContent).toContain("UID:DENTAL-TEST01@evanclinic.sa");
    expect(event.icsContent).toContain("STATUS:TENTATIVE");
  });
});
