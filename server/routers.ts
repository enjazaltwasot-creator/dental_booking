import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";
import { generateClinicAssistantReply } from "./clinicAssistant";
import { notifyOwner } from "./_core/notification";
import { ADMIN_SESSION_MAX_AGE_MS, createAdminSession, hashAdminPassword, readAdminSession, verifyAdminPassword } from "./adminAuth";

function readCookie(cookieHeader: string | undefined, key: string) {
  return cookieHeader?.split(";").map(item => item.trim()).find(item => item.startsWith(`${key}=`))?.slice(key.length + 1);
}

async function getAuthenticatedAdminUsername(ctx: { req: { headers: { cookie?: string } } }) {
  const username = readAdminSession(readCookie(ctx.req.headers.cookie, "admin_session"));
  if (!username) return null;
  const account = await db.getAdminUserByUsername(username);
  return account?.isActive ? username : null;
}

const adminSessionProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const username = await getAuthenticatedAdminUsername(ctx);
  if (!username) throw new TRPCError({ code: "UNAUTHORIZED", message: "تسجيل الدخول الإداري مطلوب" });
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Admin authentication
  admin: router({
    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        let account = await db.getAdminUserByUsername(input.username);
        if (!account && input.username === "admin" && input.password === "admin123") {
          const password = await hashAdminPassword("admin123");
          try {
            await db.createAdminUser({ username: "admin", password, name: "المسؤول الرئيسي" });
          } catch {
            // A parallel first login may have created the default account already.
          }
          account = await db.getAdminUserByUsername(input.username);
        }

        if (account?.isActive && await verifyAdminPassword(input.password, account.password)) {
          ctx.res.cookie('admin_session', createAdminSession(account.username ?? input.username), {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: ADMIN_SESSION_MAX_AGE_MS,
          });
          return { success: true, message: 'تم تسجيل الدخول بنجاح' };
        }
        throw new TRPCError({ code: "UNAUTHORIZED", message: "بيانات اعتماد غير صحيحة" });
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie('admin_session', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });
      return { success: true };
    }),

    checkAuth: publicProcedure.query(async ({ ctx }) => {
      const username = await getAuthenticatedAdminUsername(ctx);
      return { isAuthenticated: !!username, username };
    }),

    users: router({
      list: adminSessionProcedure.query(async () => {
        const accounts = await db.listAdminUsers();
        return accounts.map(account => ({
          id: account.id,
          username: account.username,
          name: account.name,
          role: account.role,
          isActive: account.isActive,
          createdAt: account.createdAt,
          lastSignedIn: account.lastSignedIn,
        }));
      }),
      create: adminSessionProcedure
        .input(z.object({ username: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9_.-]+$/), name: z.string().trim().min(2).max(100).optional(), password: z.string().min(8).max(128) }))
        .mutation(async ({ input }) => {
          if (await db.getAdminUserByUsername(input.username)) throw new TRPCError({ code: "CONFLICT", message: "اسم المستخدم مستخدم بالفعل" });
          const password = await hashAdminPassword(input.password);
          const account = await db.createAdminUser({ ...input, password });
          return { id: account?.id, username: account?.username };
        }),
      update: adminSessionProcedure
        .input(z.object({ username: z.string().min(1), name: z.string().trim().max(100).optional(), password: z.string().min(8).max(128).optional() }))
        .mutation(async ({ input }) => {
          if (!input.name && !input.password) throw new TRPCError({ code: "BAD_REQUEST", message: "أدخل اسماً أو كلمة مرور جديدة" });
          const password = input.password ? await hashAdminPassword(input.password) : undefined;
          const account = await db.updateAdminUser(input.username, { name: input.name, password });
          if (!account) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
          return { id: account.id, username: account.username };
        }),
      setActive: adminSessionProcedure
        .input(z.object({ username: z.string().min(1), isActive: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
          const requester = await getAuthenticatedAdminUsername(ctx);
          const account = await db.getAdminUserByUsername(input.username);
          if (!account) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
          if (account.username === requester) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن تعطيل الحساب المستخدم حالياً" });
          if (!input.isActive && account.isActive && await db.countActiveAdminUsers() <= 1) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن تعطيل آخر مسؤول نشط" });
          return db.setAdminUserActive(input.username, input.isActive);
        }),
      remove: adminSessionProcedure
        .input(z.object({ username: z.string().min(1) }))
        .mutation(async ({ input, ctx }) => {
          const requester = await getAuthenticatedAdminUsername(ctx);
          const account = await db.getAdminUserByUsername(input.username);
          if (!account) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
          if (account.username === requester) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن حذف الحساب المستخدم حالياً" });
          if (account.isActive && await db.countActiveAdminUsers() <= 1) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن حذف آخر مسؤول نشط" });
          await db.deleteAdminUser(input.username);
          return { success: true };
        }),
    }),

    exportBookings: adminSessionProcedure.query(async () => {
      const [bookings, services, dentists] = await Promise.all([db.getAllBookings(), db.getAllServicesForAdmin(), db.getAllDentists()]);
      return bookings.map(booking => ({
        referenceNumber: booking.referenceNumber,
        patientName: booking.patientName,
        patientPhone: booking.patientPhone,
        branch: booking.branch ?? "",
        appointmentDate: booking.appointmentDate.toISOString().slice(0, 10),
        appointmentTime: String(booking.appointmentTime).slice(0, 5),
        status: booking.status,
        service: services.find(service => service.id === booking.serviceId)?.name ?? "",
        dentist: dentists.find(dentist => dentist.id === booking.dentistId)?.name ?? "",
        notes: booking.notes ?? "",
      }));
    }),
  }),

  assistant: router({
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(1500),
        })).min(1).max(10),
      }))
      .mutation(async ({ input }) => ({
        reply: await generateClinicAssistantReply(input.messages),
      })),
  }),

  // Services
  services: router({
    list: publicProcedure.query(async () => {
      return db.getAllServices();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getServiceById(input.id);
      }),
    listForAdmin: adminSessionProcedure.query(async () => db.getAllServicesForAdmin()),
    create: adminSessionProcedure
      .input(z.object({ name: z.string().trim().min(2).max(100), description: z.string().trim().max(1000).optional(), duration: z.number().int().min(5).max(240) }))
      .mutation(async ({ input }) => db.createService(input)),
    update: adminSessionProcedure
      .input(z.object({ id: z.number().int().positive(), name: z.string().trim().min(2).max(100), description: z.string().trim().max(1000).optional(), duration: z.number().int().min(5).max(240) }))
      .mutation(async ({ input }) => db.updateService(input.id, input)),
    setActive: adminSessionProcedure
      .input(z.object({ id: z.number().int().positive(), isActive: z.boolean() }))
      .mutation(async ({ input }) => db.setServiceActive(input.id, input.isActive)),
  }),

  // Dentists
  dentists: router({
    list: publicProcedure.query(async () => {
      return db.getAllDentists();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getDentistById(input.id);
      }),
  }),

  // Working hours
  workingHours: router({
    getByDentistAndDay: publicProcedure
      .input(z.object({ dentistId: z.number(), dayOfWeek: z.number() }))
      .query(async ({ input }) => {
        return db.getWorkingHoursByDentistAndDay(input.dentistId, input.dayOfWeek);
      }),
    availableSlots: publicProcedure
      .input(z.object({ dentistId: z.number(), date: z.string() }))
      .query(async ({ input }) => {
        if (!input.dentistId || !input.date) return [];
        const target = new Date(`${input.date}T00:00:00`);
        if (Number.isNaN(target.getTime())) return [];
        const dayOfWeek = target.getDay();

        const hours = await db.getWorkingHoursByDentistAndDay(input.dentistId, dayOfWeek);
        if (!hours.length) return [];

        const booked = await db.getBookingsByDentistAndDate(input.dentistId, target);
        const takenTimes = new Set(
          booked.map(b => String(b.appointmentTime).slice(0, 5))
        );

        const toMinutes = (value: string) => {
          const [h, m] = String(value).split(":").map(Number);
          return h * 60 + (m || 0);
        };
        const toLabel = (total: number) => {
          const h = Math.floor(total / 60);
          const m = total % 60;
          return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        };

        const SLOT_MINUTES = 30;
        const slots: string[] = [];
        for (const window of hours) {
          const start = toMinutes(window.startTime as unknown as string);
          const end = toMinutes(window.endTime as unknown as string);
          for (let t = start; t + SLOT_MINUTES <= end; t += SLOT_MINUTES) {
            const label = toLabel(t);
            if (!takenTimes.has(label) && !slots.includes(label)) {
              slots.push(label);
            }
          }
        }
        return slots.sort();
      }),
  }),

  // Bookings
  bookings: router({
    create: publicProcedure
      .input(z.object({
        branch: z.enum(['mahdiyah', 'olaya', 'ahmadiyah-laban']),
        dentistId: z.number(),
        serviceId: z.number(),
        patientName: z.string().min(1),
        patientPhone: z.string().min(1),
        appointmentDate: z.string().transform(str => new Date(str)),
        appointmentTime: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const service = await db.getServiceById(input.serviceId);
        if (!service?.isActive) throw new TRPCError({ code: "BAD_REQUEST", message: "الخدمة غير متاحة للحجز حالياً" });
        const referenceNumber = `DENTAL-${nanoid(8).toUpperCase()}`;
        const booking = await db.createBooking({
          referenceNumber,
          branch: input.branch,
          dentistId: input.dentistId,
          serviceId: input.serviceId,
          patientName: input.patientName,
          patientPhone: input.patientPhone,
          appointmentDate: input.appointmentDate,
          appointmentTime: input.appointmentTime,
          notes: input.notes,
        });
        await db.createBookingReminderQueue(booking);
        await db.queueCrmBookingCreatedEvent(booking);
        try {
          await notifyOwner({
            title: "طلب حجز جديد — مجموعة إيفان الطبية",
            content: `تم تسجيل حجز جديد بالرقم ${booking.referenceNumber} في فرع ${input.branch}. الموعد: ${input.appointmentDate.toLocaleDateString("ar-SA")} الساعة ${input.appointmentTime}.`,
          });
        } catch (error) {
          console.warn("[Booking] Owner notification failed", error);
        }
        return booking;
      }),

    getByReferenceNumber: publicProcedure
      .input(z.object({ referenceNumber: z.string() }))
      .query(async ({ input }) => {
        return db.getBookingByReferenceNumber(input.referenceNumber);
      }),

    getAll: adminSessionProcedure.query(async () => {
      return db.getAllBookings();
    }),

    getByDentistAndDate: publicProcedure
      .input(z.object({ 
        dentistId: z.number(),
        appointmentDate: z.string().transform(str => new Date(str))
      }))
      .query(async ({ input }) => {
        return db.getBookingsByDentistAndDate(input.dentistId, input.appointmentDate);
      }),

    updateStatus: adminSessionProcedure
      .input(z.object({
        referenceNumber: z.string(),
        status: z.enum(['pending', 'confirmed', 'cancelled']),
      }))
      .mutation(async ({ input }) => {
        return db.updateBookingStatus(input.referenceNumber, input.status);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getBookingById(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
