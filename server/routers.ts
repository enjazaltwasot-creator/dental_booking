import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";

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
  }),

  // Bookings
  bookings: router({
    create: publicProcedure
      .input(z.object({
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
        return db.createBooking({
          referenceNumber,
          dentistId: input.dentistId,
          serviceId: input.serviceId,
          patientName: input.patientName,
          patientPhone: input.patientPhone,
          appointmentDate: input.appointmentDate,
          appointmentTime: input.appointmentTime,
          notes: input.notes,
        });
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
