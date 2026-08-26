import { motion, useInView, useReducedMotion } from "framer-motion";
import { Activity, UserCheck, UserPlus } from "lucide-react";
import { useRef } from "react";

const METRIC_CARDS = [
  {
    icon: Activity,
    title: "إجمالي الحالات",
    detail: "مؤشر تشغيلي شامل",
    accent: "from-cyan-300 via-sky-500 to-primary",
    glow: "bg-sky-400/35",
  },
  {
    icon: UserCheck,
    title: "عملاء حاليون",
    detail: "استمرارية التواصل والرعاية",
    accent: "from-orange-200 via-orange-400 to-accent",
    glow: "bg-orange-300/40",
  },
  {
    icon: UserPlus,
    title: "عملاء جدد",
    detail: "مراجعون يبدأون رحلتهم معنا",
    accent: "from-emerald-200 via-teal-400 to-cyan-600",
    glow: "bg-emerald-300/35",
  },
] as const;

export default function JourneyProgressCharts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.24 });
  const reduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#071b3b] py-20 text-white sm:py-24">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(46,202,255,0.2),transparent_25%),radial-gradient(circle_at_85%_78%,rgba(255,130,38,0.2),transparent_25%)]" />
      <div aria-hidden="true" className="absolute -right-28 -top-24 size-96 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -bottom-40 -left-28 size-[32rem] rounded-full border border-white/10" />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-sky-100 backdrop-blur">مؤشرات تجربة المراجعين</span>
          <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">نموٌّ نتابعه بعناية، ورعايةٌ تبقى قريبة.</h2>
          <p className="mt-4 text-[15px] leading-8 text-slate-200">تصميم بصري ثلاثي الأبعاد لعرض مؤشرات المجموعة. تُحدَّث القيم عند اعتماد التقرير التشغيلي الدوري.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-7 md:grid-cols-3" style={{ perspective: "1200px" }}>
          {METRIC_CARDS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.article
                key={metric.title}
                initial={reduceMotion ? false : { opacity: 0, y: 32, rotateX: 12 }}
                animate={reduceMotion || isInView ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
                transition={{ duration: 0.65, delay: index * 0.13, ease: [0.23, 1, 0.32, 1] }}
                className="group relative min-h-[295px] [transform-style:preserve-3d]"
              >
                <div aria-hidden="true" className={`absolute inset-x-7 bottom-2 h-12 rounded-[1.65rem] ${metric.glow} blur-2xl transition-transform duration-500 group-hover:translate-y-3`} />
                <div aria-hidden="true" className="absolute inset-x-5 bottom-1 h-20 origin-bottom rounded-[1.45rem] border border-white/10 bg-[#041127] opacity-85 [transform:rotateX(63deg)]" />
                <div className="relative h-full overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/[0.09] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl transition duration-500 [transform:translateZ(24px)] group-hover:[transform:translateZ(44px)_translateY(-8px)] sm:p-7">
                  <div aria-hidden="true" className={`absolute -right-10 top-8 size-36 rounded-full bg-gradient-to-br ${metric.accent} opacity-25 blur-2xl`} />
                  <div aria-hidden="true" className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="relative flex h-full flex-col">
                    <span className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg"><Icon className="size-5" /></span>
                    <div className="mt-9">
                      <p className="text-sm font-bold text-sky-100">{metric.detail}</p>
                      <h3 className="mt-2 text-2xl font-black">{metric.title}</h3>
                    </div>
                    <div className="mt-auto pt-8">
                      <div className="relative h-16 [transform-style:preserve-3d]">
                        <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-10 rounded-xl bg-gradient-to-l ${metric.accent} opacity-55 [transform:rotateX(56deg)_translateY(14px)]`} />
                        <div aria-hidden="true" className={`absolute inset-x-3 bottom-3 h-9 rounded-xl bg-gradient-to-l ${metric.accent} shadow-[0_12px_28px_rgba(0,0,0,0.28)]`} />
                      </div>
                      <p className="mt-3 text-xs font-bold text-slate-200">القيمة: <span className="text-white">قيد التحديث</span></p>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-6 text-slate-300">تُعرض الأرقام الفعلية بعد اعتمادها من التقرير التشغيلي للمجموعة؛ لا تُستنتج هذه المؤشرات من بيانات الإعلانات وحدها.</p>
      </div>
    </section>
  );
}
