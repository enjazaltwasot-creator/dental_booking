import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";
import { generateClinicAssistantReply } from "./clinicAssistant";
import { notifyOwner } from "./_core/notification";

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
        const ADMIN_USERNAME = 'admin';
        const ADMIN_PASSWORD = 'admin123';

        if (input.username === ADMIN_USERNAME && input.password === ADMIN_PASSWORD) {
          ctx.res.cookie('admin_session', 'authenticated', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
          });
          return { success: true, message: 'تم تسجيل الدخول بنجاح' };
        }
        throw new Error('بيانات اعتماد غير صحيحة');
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

    checkAuth: publicProcedure.query(({ ctx }) => {
      const adminCookie = ctx.req.headers.cookie?.includes('admin_session=authenticated');
      return { isAuthenticated: !!adminCookie };
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

    getAll: publicProcedure.query(async () => {
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

    updateStatus: publicProcedure
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
