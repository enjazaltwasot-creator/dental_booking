import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";

const DENTAL_HERO_ASSET = "/manus-storage/evan-fullwidth-dental-hero_2a1eeedf.png";

export default function FullWidthDentalHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[670px] overflow-hidden border-b border-primary/10 bg-[#dff3ff] sm:min-h-[690px] lg:min-h-[720px]">
      <motion.img
        src={DENTAL_HERO_ASSET}
        alt="مشهد ثلاثي الأبعاد لسنّ أبيض يرمز إلى الرعاية السنية المتخصصة"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[33%_center] sm:object-[38%_center] lg:hidden"
        initial={{ scale: 1.03 }}
        animate={reduceMotion ? undefined : { scale: [1.03, 1.07, 1.03], x: [0, -5, 0], y: [0, 3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -left-8 top-1/2 -z-20 hidden w-[54%] -translate-y-1/2 lg:block"
        initial={false}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: [-8, 14, -8], y: [-8, 8, -8], rotate: [-0.55, 0.65, -0.55], scale: [1, 1.025, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={DENTAL_HERO_ASSET} alt="" className="h-auto w-full" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-l from-white via-white/74 to-primary/5 lg:via-white/50 lg:to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 -z-10 bg-gradient-to-t from-white/85 to-transparent" />

      <div className="container flex min-h-[670px] items-end py-8 sm:min-h-[690px] sm:py-12 lg:min-h-[720px] lg:items-center lg:py-20">
        <div className="w-full max-w-xl rounded-[1.75rem] border border-white/60 bg-white/78 p-6 text-right shadow-xl shadow-primary/10 backdrop-blur-md sm:p-8 lg:mr-0 lg:ml-auto lg:max-w-2xl lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-3 py-1.5 text-xs font-extrabold text-primary shadow-sm">
            <Sparkles className="size-3.5" />
            طب الأسنان — مجموعة إيفان الطبية
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.14] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            ابتسامة صحية،
            <span className="mt-2 block text-primary">تبدأ من رعاية أدق.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-8 text-slate-600 sm:text-lg">
            رعاية سنية متخصصة تجمع الخبرة الطبية والتقنيات الحديثة وخيارات حجز واضحة عبر فروع مجموعة إيفان الطبية في الرياض.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/booking" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-extrabold text-accent-foreground shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              <CalendarCheck className="size-4" />
              احجز موعد أسنان
            </Link>
            <a href="#specialties" className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white/85 px-6 py-3.5 text-sm font-extrabold text-primary shadow-sm transition-all duration-200 hover:border-primary/35 hover:shadow-md">
              اكتشف التخصصات
              <ArrowLeft className="size-4" />
            </a>
          </div>
          <div className="mt-8 grid max-w-md grid-cols-3 divide-x divide-x-reverse divide-primary/10 rounded-2xl border border-primary/10 bg-white/76 p-3 shadow-sm">
            <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-primary">3</strong><span className="mt-1 block text-[11px] font-bold text-slate-500">فروع في الرياض</span></div>
            <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-primary">3</strong><span className="mt-1 block text-[11px] font-bold text-slate-500">مجالات تخصصية</span></div>
            <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-primary">1</strong><span className="mt-1 block text-[11px] font-bold text-slate-500">رحلة حجز موحّدة</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
