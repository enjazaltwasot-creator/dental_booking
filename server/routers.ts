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

type AdminPermission = "full_access" | "operations" | "bookings";

async function getAuthenticatedAdmin(ctx: { req: { headers: { cookie?: string } } }): Promise<{ username: string; permission: AdminPermission } | null> {
  const username = await getAuthenticatedAdminUsername(ctx);
  if (!username) return null;
  const account = await db.getAdminUserByUsername(username);
  if (!account?.isActive) return null;
  return { username, permission: account.adminPermission };
}

const adminSessionProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const username = await getAuthenticatedAdminUsername(ctx);
  if (!username) throw new TRPCError({ code: "UNAUTHORIZED", message: "تسجيل الدخول الإداري مطلوب" });
  return next();
});

const operationsProcedure = adminSessionProcedure.use(async ({ ctx, next }) => {
  const admin = await getAuthenticatedAdmin(ctx);
  if (!admin || admin.permission === "bookings") throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية إدارة الفروع والخدمات" });
  return next();
});

const fullAccessProcedure = adminSessionProcedure.use(async ({ ctx, next }) => {
  const admin = await getAuthenticatedAdmin(ctx);
  if (!admin || admin.permission !== "full_access") throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية إدارة الحسابات" });
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
            await db.createAdminUser({ username: "admin", password, name: "المسؤول الرئيسي", permission: "full_access" });
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
      const admin = await getAuthenticatedAdmin(ctx);
      return { isAuthenticated: !!admin, username: admin?.username ?? null, permission: admin?.permission ?? null };
    }),

    users: router({
      list: fullAccessProcedure.query(async () => {
        const accounts = await db.listAdminUsers();
        return accounts.map(account => ({
          id: account.id,
          username: account.username,
          name: account.name,
          role: account.role,
          isActive: account.isActive,
          permission: account.adminPermission,
          createdAt: account.createdAt,
          lastSignedIn: account.lastSignedIn,
        }));
      }),
      create: fullAccessProcedure
        .input(z.object({ username: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9_.-]+$/), name: z.string().trim().min(2).max(100).optional(), password: z.string().min(8).max(128), permission: z.enum(["full_access", "operations", "bookings"]).default("bookings") }))
        .mutation(async ({ input }) => {
          if (await db.getAdminUserByUsername(input.username)) throw new TRPCError({ code: "CONFLICT", message: "اسم المستخدم مستخدم بالفعل" });
          const password = await hashAdminPassword(input.password);
          const account = await db.createAdminUser({ username: input.username, name: input.name, password, permission: input.permission });
          return { id: account?.id, username: account?.username };
        }),
      update: fullAccessProcedure
        .input(z.object({ username: z.string().min(1), name: z.string().trim().max(100).optional(), password: z.string().min(8).max(128).optional() }))
        .mutation(async ({ input }) => {
          if (!input.name && !input.password) throw new TRPCError({ code: "BAD_REQUEST", message: "أدخل اسماً أو كلمة مرور جديدة" });
          const password = input.password ? await hashAdminPassword(input.password) : undefined;
          const account = await db.updateAdminUser(input.username, { name: input.name, password });
          if (!account) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
          return { id: account.id, username: account.username };
        }),
      setActive: fullAccessProcedure
        .input(z.object({ username: z.string().min(1), isActive: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
          const requester = await getAuthenticatedAdminUsername(ctx);
          const account = await db.getAdminUserByUsername(input.username);
          if (!account) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
          if (account.username === requester) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن تعطيل الحساب المستخدم حالياً" });
          if (!input.isActive && account.isActive && account.adminPermission === "full_access" && await db.countActiveFullAccessAdmins() <= 1) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن تعطيل آخر مسؤول كامل الصلاحيات" });
          return db.setAdminUserActive(input.username, input.isActive);
        }),
      remove: fullAccessProcedure
        .input(z.object({ username: z.string().min(1) }))
        .mutation(async ({ input, ctx }) => {
          const requester = await getAuthenticatedAdminUsername(ctx);
          const account = await db.getAdminUserByUsername(input.username);
          if (!account) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
          if (account.username === requester) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن حذف الحساب المستخدم حالياً" });
          if (account.isActive && account.adminPermission === "full_access" && await db.countActiveFullAccessAdmins() <= 1) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن حذف آخر مسؤول كامل الصلاحيات" });
          await db.deleteAdminUser(input.username);
          return { success: true };
        }),
      setPermission: fullAccessProcedure
        .input(z.object({ username: z.string().min(1), permission: z.enum(["full_access", "operations", "bookings"]) }))
        .mutation(async ({ input, ctx }) => {
          const requester = await getAuthenticatedAdminUsername(ctx);
          const account = await db.getAdminUserByUsername(input.username);
          if (!account) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
          if (account.username === requester && input.permission !== "full_access") throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن خفض صلاحيات الحساب المستخدم حالياً" });
          if (account.adminPermission === "full_access" && input.permission !== "full_access" && account.isActive && await db.countActiveFullAccessAdmins() <= 1) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن خفض صلاحيات آخر مسؤول كامل الصلاحيات" });
          return db.setAdminUserPermission(input.username, input.permission);
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
        sessionKey: z.string().trim().min(16).max(64).regex(/^[a-zA-Z0-9:_-]+$/),
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(1500),
        })).min(1).max(10),
      }))
      .mutation(async ({ input }) => {
        const reply = await generateClinicAssistantReply(input.messages);
        const latestUserMessage = [...input.messages].reverse().find(message => message.role === "user");
        if (latestUserMessage) {
          try {
            await db.recordAssistantConversation({
              sessionKey: input.sessionKey,
              messages: [latestUserMessage, { role: "assistant", content: reply }],
            });
          } catch (error) {
            console.warn("[Assistant] Conversation logging failed", error);
          }
        }
        return { reply };
      }),
    conversations: router({
      list: adminSessionProcedure
        .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional())
        .query(async ({ input }) => db.listAssistantConversations(input?.limit ?? 50)),
      messages: adminSessionProcedure
        .input(z.object({ conversationId: z.number().int().positive() }))
        .query(async ({ input }) => db.getAssistantMessages(input.conversationId)),
    }),
  }),

  // Services
  services: router({
    list: publicProcedure.query(async () => {
      return db.getAllServices();
    }),
    listForBranch: publicProcedure.input(z.object({ branch: z.string().trim().min(3).max(64).regex(/^[a-z0-9-]+$/) })).query(({ input }) => db.getServicesForBranch(input.branch)),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getServiceById(input.id);
      }),
    listForAdmin: adminSessionProcedure.query(async () => db.getAllServicesForAdmin()),
    create: operationsProcedure
      .input(z.object({ name: z.string().trim().min(2).max(100), description: z.string().trim().max(1000).optional(), duration: z.number().int().min(5).max(240), department: z.enum(["dentistry", "dermatology", "laser"]).default("dentistry") }))
      .mutation(async ({ input }) => db.createService(input)),
    update: operationsProcedure
      .input(z.object({ id: z.number().int().positive(), name: z.string().trim().min(2).max(100), description: z.string().trim().max(1000).optional(), duration: z.number().int().min(5).max(240), department: z.enum(["dentistry", "dermatology", "laser"]) }))
      .mutation(async ({ input }) => { const { id, ...values } = input; return db.updateService(id, values); }),
    setActive: operationsProcedure
      .input(z.object({ id: z.number().int().positive(), isActive: z.boolean() }))
      .mutation(async ({ input }) => db.setServiceActive(input.id, input.isActive)),
    remove: operationsProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const result = await db.deleteServiceIfUnused(input.id);
        if (result === "not_found") throw new TRPCError({ code: "NOT_FOUND", message: "الخدمة غير موجودة" });
        if (result === "in_use") throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن حذف خدمة مرتبطة بحجوزات سابقة؛ أوقفها بدلاً من ذلك" });
        return { success: true };
      }),
  }),

  branches: router({
    list: publicProcedure.query(() => db.getActiveBranches()),
    listForAdmin: adminSessionProcedure.query(() => db.getAllBranches()),
    create: operationsProcedure.input(z.object({ slug: z.string().trim().min(3).max(64).regex(/^[a-z0-9-]+$/), name: z.string().trim().min(3).max(140), shortName: z.string().trim().min(2).max(100), city: z.string().trim().min(2).max(140), address: z.string().trim().max(500).optional(), phone: z.string().trim().max(20).optional() })).mutation(async ({ input }) => {
      if (await db.getBranchBySlug(input.slug)) throw new TRPCError({ code: "CONFLICT", message: "رمز الفرع مستخدم بالفعل" });
      return db.createBranch(input);
    }),
    update: operationsProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().trim().min(3).max(140), shortName: z.string().trim().min(2).max(100), city: z.string().trim().min(2).max(140), address: z.string().trim().max(500).optional(), phone: z.string().trim().max(20).optional() })).mutation(({ input }) => {
      const { id, ...values } = input;
      return db.updateBranch(id, values);
    }),
    setActive: operationsProcedure.input(z.object({ id: z.number().int().positive(), isActive: z.boolean() })).mutation(({ input }) => db.setBranchActive(input.id, input.isActive)),
    remove: operationsProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const result = await db.deleteBranchIfUnused(input.id);
      if (result === "not_found") throw new TRPCError({ code: "NOT_FOUND", message: "الفرع غير موجود" });
      if (result === "in_use") throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن حذف فرع مرتبط بحجوزات سابقة؛ أوقفه بدلاً من ذلك" });
      return { success: true };
    }),
  }),

  branchSpecialties: router({
    listForAdmin: adminSessionProcedure.query(() => db.getAllBranchSpecialties()),
    setActive: operationsProcedure.input(z.object({ branchId: z.number().int().positive(), department: z.enum(["dentistry", "dermatology", "laser"]), isActive: z.boolean() })).mutation(({ input }) => db.setBranchSpecialtyActive(input.branchId, input.department, input.isActive)),
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
        branch: z.string().trim().min(3).max(64).regex(/^[a-z0-9-]+$/),
        dentistId: z.number(),
        serviceId: z.number(),
        patientName: z.string().min(1),
        patientPhone: z.string().min(1),
        appointmentDate: z.string().transform(str => new Date(str)),
        appointmentTime: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const [service, branch] = await Promise.all([db.getServiceById(input.serviceId), db.getBranchBySlug(input.branch)]);
        if (!service?.isActive) throw new TRPCError({ code: "BAD_REQUEST", message: "الخدمة غير متاحة للحجز حالياً" });
        if (!branch?.isActive) throw new TRPCError({ code: "BAD_REQUEST", message: "الفرع غير متاح للحجز حالياً" });
        if (!(await db.getBranchSpecialties(branch.id)).some(item => item.department === service.department && item.isActive)) throw new TRPCError({ code: "BAD_REQUEST", message: "هذه الخدمة غير متاحة في الفرع المختار حالياً" });
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
