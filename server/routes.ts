import { Express } from "express";
import { db } from "./db";
import { users, localAuth } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

// مخطط التحقق من المدخلات باستخدام Zod
const loginSchema = z.object({
  username: z
    .string({ required_error: "اسم المستخدم مطلوب" })
    .min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" })
    .trim(),
  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(6, { message: "كلمة المرور يجب أن لا تقل عن 6 أحرف" }),
});

export function registerRoutes(app: Express) {
  app.post("/api/admin/login", async (req, res) => {
    
    // 1. التحقق من صحة وشكل المدخلات
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const { username, password } = validationResult.data;

    try {
      // 2. البحث عن المستخدم باسم المستخدم
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

      if (!user || user.role !== "admin") {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      // 3. جلب كلمة السر المشفرة من جدول localAuth
      const [authRecord] = await db
        .select()
        .from(localAuth)
        .where(eq(localAuth.openId, user.openId));

      if (!authRecord) {
        return res.status(401).json({ message: "لا توجد كلمة مرور مسجلة لهذا الحساب" });
      }

      // 4. مطابقة كلمة المرور
      const isPasswordValid = await bcrypt.compare(password, authRecord.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      // 5. تحديث تاريخ آخر تسجيل دخول
      await db
        .update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.id, user.id));

      // 6. إرجاع الاستجابة للواجهة
      return res.json({
        message: "تم تسجيل الدخول بنجاح",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
      });

    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ message: "حدث خطأ في السيرفر أثناء تسجيل الدخول" });
    }
  });
}
