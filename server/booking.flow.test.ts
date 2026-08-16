import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getBookingReminders, getCrmSyncEvents } from "./db";

function createPublicContext() {
  const cookies: Record<string, unknown>[] = [];
  const ctx = {
    user: null,
    req: { protocol: "https", headers: {} },
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        cookies.push({ name, value, options });
      },
      clearCookie: () => {},
    },
  } as unknown as TrpcContext;
  return { ctx, cookies };
}

function createAdminContext() {
  return {
    user: null,
    req: { protocol: "https", headers: { cookie: "admin_session=authenticated" } },
    res: { cookie: () => {}, clearCookie: () => {} },
  } as unknown as TrpcContext;
}

describe("catalog data", () => {
  it("returns the seeded services", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    const services = await caller.services.list();

    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
    expect(services[0]).toHaveProperty("name");
    expect(services[0]).toHaveProperty("duration");
  });

  it("returns the seeded dentists", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    const dentists = await caller.dentists.list();

    expect(dentists.length).toBeGreaterThan(0);
    expect(dentists[0]).toHaveProperty("specialization");
  });
});

describe("availability", () => {
  it("returns 30-minute slots for a working day", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    // 2026-08-10 is a Monday (dayOfWeek = 1)
    const slots = await caller.workingHours.availableSlots({
      dentistId: 1,
      date: "2026-08-10",
    });

    expect(slots.length).toBeGreaterThan(0);
    expect(slots).toContain("09:00");
    slots.forEach(slot => expect(slot).toMatch(/^\d{2}:\d{2}$/));
  });

  it("returns an empty list for an invalid date", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    const slots = await caller.workingHours.availableSlots({
      dentistId: 1,
      date: "not-a-date",
    });

    expect(slots).toEqual([]);
  });
});

describe("booking lifecycle", () => {
  it("creates a booking, exposes it by reference, and updates its status", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);

    const slots = await caller.workingHours.availableSlots({
      dentistId: 1,
      date: "2026-09-14",
    });
    expect(slots.length).toBeGreaterThan(0);

    const created = await caller.bookings.create({
      branch: "mahdiyah",
      dentistId: 1,
      serviceId: 1,
      patientName: "مريض اختبار آلي",
      patientPhone: "0500000000",
      appointmentDate: "2026-09-14",
      appointmentTime: slots[slots.length - 1],
      notes: "سجل اختبار",
    });

    expect(created.referenceNumber).toMatch(/^DENTAL-[A-Za-z0-9_-]{8}$/);
    expect(created.status).toBe("pending");
    expect(created.branch).toBe("mahdiyah");

    const reminders = await getBookingReminders(created.id);
    expect(reminders.map(reminder => reminder.reminderType).sort()).toEqual([
      "before_24h",
      "before_48h",
      "booking_created",
    ]);

    const crmEvents = await getCrmSyncEvents(created.referenceNumber);
    expect(crmEvents).toHaveLength(1);
    expect(crmEvents[0]).toMatchObject({ eventType: "booking_created", status: "pending" });

    const fetched = await caller.bookings.getByReferenceNumber({
      referenceNumber: created.referenceNumber,
    });
    expect(fetched?.patientName).toBe("مريض اختبار آلي");

    const confirmed = await caller.bookings.updateStatus({
      referenceNumber: created.referenceNumber,
      status: "confirmed",
    });
    expect(confirmed?.status).toBe("confirmed");

    const cancelled = await caller.bookings.updateStatus({
      referenceNumber: created.referenceNumber,
      status: "cancelled",
    });
    expect(cancelled?.status).toBe("cancelled");
  });

  it("removes a booked slot from availability", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    let date = "";
    let before: string[] = [];
    const start = new Date("2099-09-21T00:00:00.000Z");

    for (let offset = 0; offset < 120; offset += 1) {
      const candidate = new Date(start);
      candidate.setUTCDate(start.getUTCDate() + offset);
      const candidateDate = candidate.toISOString().slice(0, 10);
      const slots = await caller.workingHours.availableSlots({ dentistId: 2, date: candidateDate });
      if (slots.length > 0) {
        date = candidateDate;
        before = slots;
        break;
      }
    }

    expect(before.length).toBeGreaterThan(0);

    const target = before[0];
    await caller.bookings.create({
      branch: "olaya",
      dentistId: 2,
      serviceId: 1,
      patientName: "اختبار التعارض",
      patientPhone: "0511111111",
      appointmentDate: date,
      appointmentTime: target,
    });

    const after = await caller.workingHours.availableSlots({ dentistId: 2, date });
    expect(after).not.toContain(target);
    expect(after.length).toBe(before.length - 1);
  });

  it("rejects an unrecognized branch when creating a booking", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);

    await expect(
      caller.bookings.create({
        branch: "unknown-branch" as "mahdiyah",
        dentistId: 1,
        serviceId: 1,
        patientName: "اختبار فرع غير صالح",
        patientPhone: "0522222222",
        appointmentDate: "2099-09-21",
        appointmentTime: "09:00",
      })
    ).rejects.toThrow();
  });
});

describe("admin authentication", () => {
  it("accepts the default credentials and sets a session cookie", async () => {
    const { ctx, cookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.login({ username: "admin", password: "admin123" });

    expect(result.success).toBe(true);
    expect(cookies[0]?.name).toBe("admin_session");
  });

  it("rejects wrong credentials", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);

    await expect(
      caller.admin.login({ username: "admin", password: "wrong-password" })
    ).rejects.toThrow();
  });

  it("reports unauthenticated when no cookie is present", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    const auth = await caller.admin.checkAuth();
    expect(auth.isAuthenticated).toBe(false);
  });

  it("reports authenticated when the session cookie is present", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const auth = await caller.admin.checkAuth();
    expect(auth.isAuthenticated).toBe(true);
  });
});
