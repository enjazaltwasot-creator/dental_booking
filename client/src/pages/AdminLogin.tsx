import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation } from "wouter";
import { Lock, Loader2, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { LOGO_SRC } from "@/lib/clinic";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const utils = trpc.useUtils();

  const login = trpc.admin.login.useMutation({
    onSuccess: async () => {
      await utils.admin.checkAuth.invalidate();
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/admin");
    },
    onError: () => {
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    login.mutate({ username: username.trim(), password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src={LOGO_SRC} alt="مجموعة عيادات إيفان الطبية" className="mx-auto h-12 w-auto" />
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-6" />
            </span>
            <h1 className="mt-4 text-xl font-extrabold text-foreground">لوحة التحكم</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              تسجيل الدخول إلى لوحة إدارة الحجوزات
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-foreground">
                اسم المستخدم
              </label>
              <div className="relative mt-2">
                <User className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-xl border border-border bg-white py-3 pe-10 ps-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                كلمة المرور
              </label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-white py-3 pe-10 ps-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all duration-200 hover:shadow-md disabled:opacity-50"
            >
              {login.isPending && <Loader2 className="size-4 animate-spin" />}
              تسجيل الدخول
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-secondary/60 p-4 text-center text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">بيانات الدخول الافتراضية</p>
            <p className="mt-1" dir="ltr">admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
