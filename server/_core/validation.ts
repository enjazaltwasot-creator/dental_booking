import { z } from "zod";

// مخطط التحقق من بيانات تسجيل الدخول
export const loginSchema = z.object({
  username: z
    .string({ required_error: "اسم المستخدم مطلوب" })
    .min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" })
    .trim(),
  
  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(6, { message: "كلمة المرور يجب أن لا تقل عن 6 أحرف" }),
});
