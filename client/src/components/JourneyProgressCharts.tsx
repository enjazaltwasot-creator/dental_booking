import { motion, useInView, useReducedMotion } from "framer-motion";
import { BarChart3, MousePointerClick, ReceiptText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AD_METRICS = [
  {
    icon: ReceiptText,
    title: "الإنفاق الإعلاني",
    value: 33383,
    suffix: "ر.س.",
    context: "مقارنة بالفترة السابقة: انخفاض 16.9% من 40,150 ر.س.",
    comparisonWidth: 83.1,
    accent: "from-orange-400 via-accent to-orange-300",
  },
  {
    icon: MousePointerClick,
    title: "النقرات",
    value: 34595,
    suffix: "نقرة",
    context: "مقارنة بالفترة السابقة: انخفاض 24.9% من 46,078 نقرة.",
    comparisonWidth: 75.1,
    accent: "from-primary via-sky-500 to-cyan-300",
  },
  {
    icon: BarChart3,
    title: "التحويلات المسجلة",
    value: 4,
    suffix: "تحويلات",
    context: "تحويلات مسجلة في Google Ads خلال فترة القياس، وليست حالات علاجية أو عملاء.",
    comparisonWidth: 100,
    accent: "from-emerald-500 via-cyan-500 to-sky-400",
  },
] as const;

function AnimatedNumber({ value, active }: { value: number; active: boolean }) {
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }

    const startedAt = performance.now();
    const duration = 1050;
    let frameId = 0;
    const update = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [active, reduceMotion, value]);

  return <>{new Intl.NumberFormat("ar-SA").format(displayValue)}</>;
}

export default function JourneyProgressCharts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.28 });
  const reduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-primary/10 bg-[#f5f8fc] py-16 sm:py-20">
      <div aria-hidden="true" className="absolute -right-24 top-8 size-72 rounded-full bg-sky-200/50 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-20 -left-16 size-64 rounded-full bg-orange-100/80 blur-3xl" />
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/85 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-primary shadow-sm"><BarChart3 className="size-3.5" /> مؤشرات إعلانية</span>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">أداء الحملات في لوحة واحدة واضحة.</h2>
          <p className="mt-4 text-[15px] leading-8 text-muted-foreground">ملخص فعلي من حملات Google Ads للفترة من 23 يوليو إلى 21 أغسطس 2026. لا تمثل هذه الأرقام حالات علاجية أو عدد العملاء.</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-5">
          {AD_METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.article
                key={metric.title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={reduceMotion || isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
                className="relative overflow-hidden rounded-[1.6rem] border border-white bg-white/90 p-5 shadow-[0_16px_45px_rgba(21,62,115,0.08)] backdrop-blur-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary shadow-sm"><Icon className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <div>
                        <h3 className="text-base font-extrabold text-foreground sm:text-lg">{metric.title}</h3>
                        <p className="mt-1 text-xs leading-6 text-muted-foreground">{metric.context}</p>
                      </div>
                      <div className="text-left" dir="rtl">
                        <strong className="block text-3xl font-black tracking-tight text-primary sm:text-4xl"><AnimatedNumber value={metric.value} active={isInView} /></strong>
                        <span className="mt-1 block text-xs font-extrabold text-accent">{metric.suffix}</span>
                      </div>
                    </div>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={metric.title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={metric.comparisonWidth}>
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-l ${metric.accent}`}
                        initial={reduceMotion ? false : { width: "0%" }}
                        animate={reduceMotion || isInView ? { width: `${metric.comparisonWidth}%` } : undefined}
                        transition={{ duration: 1, delay: 0.22 + index * 0.18, ease: [0.23, 1, 0.32, 1] }}
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mx-auto mt-7 max-w-4xl text-center text-xs leading-6 text-muted-foreground">المصدر: Google Ads. الفترة: 23 يوليو–21 أغسطس 2026. التحويلات المسجلة مؤشر إعلاني ولا تعادل بالضرورة زيارات أو حالات علاجية مؤكدة.</p>
      </div>
    </section>
  );
}
