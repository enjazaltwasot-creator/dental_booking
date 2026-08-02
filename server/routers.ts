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

    getAll: protectedProcedure.query(async ({ ctx }) => {
      // Only admin can view all bookings
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
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

    updateStatus: protectedProcedure
      .input(z.object({
        referenceNumber: z.string(),
        status: z.enum(['pending', 'confirmed', 'cancelled']),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only admin can update booking status
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
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
