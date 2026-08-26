import { motion, useInView, useReducedMotion } from "framer-motion";
import { Building2, CalendarCheck, Stethoscope } from "lucide-react";
import { useRef } from "react";

const JOURNEY_STEPS = [
  {
    icon: Building2,
    eyebrow: "الخطوة 01 / 03",
    title: "ابدأ بالفرع الأقرب",
    text: "اختر الموقع الأنسب لزيارتك قبل الانتقال إلى الخدمات المتاحة فيه.",
    accent: "from-primary to-sky-400",
  },
  {
    icon: Stethoscope,
    eyebrow: "الخطوة 02 / 03",
    title: "حدّد الخدمة والطبيب",
    text: "تظهر الخيارات المرتبطة بالفرع، لتنتقل إلى الرعاية المناسبة بوضوح.",
    accent: "from-accent to-orange-300",
  },
  {
    icon: CalendarCheck,
    eyebrow: "الخطوة 03 / 03",
    title: "أرسل طلب الحجز",
    text: "اختر الوقت المتاح ثم أرسل التفاصيل ليتابع فريق المواعيد تأكيد الطلب.",
    accent: "from-cyan-600 to-emerald-400",
  },
] as const;

export default function JourneyProgressCharts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.28 });
  const reduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-primary/10 bg-slate-50 py-16 sm:py-20">
      <div aria-hidden="true" className="absolute -right-24 top-8 size-72 rounded-full bg-sky-100/60 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-20 -left-16 size-64 rounded-full bg-orange-100/70 blur-3xl" />
      <div className="container relative grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div className="max-w-xl">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold tracking-[0.14em] text-primary">رحلة المراجع</span>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">خطوات واضحة، من أول اختيار إلى إرسال الطلب.</h2>
          <p className="mt-4 text-[15px] leading-8 text-muted-foreground">مؤشر بصري يوضح تسلسل الحجز في إيفان: اختر الفرع، ثم الرعاية المناسبة، وأرسل طلبك في خطوات منظمة.</p>
        </div>

        <div className="space-y-5">
          {JOURNEY_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.eyebrow} className="rounded-2xl border border-white/90 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary shadow-sm"><Icon className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-extrabold text-foreground sm:text-lg">{step.title}</h3>
                      <span className="text-[11px] font-extrabold tracking-[0.14em] text-primary/70">{step.eyebrow}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.text}</p>
                  </div>
                </div>
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={step.title} aria-valuemin={0} aria-valuemax={3} aria-valuenow={index + 1}>
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-l ${step.accent}`}
                    initial={reduceMotion ? false : { clipPath: "inset(0 0 0 96%)" }}
                    animate={reduceMotion || isInView ? { clipPath: "inset(0 0 0 0)" } : undefined}
                    transition={{ duration: 0.9, delay: 0.12 + index * 0.22, ease: [0.23, 1, 0.32, 1] }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
