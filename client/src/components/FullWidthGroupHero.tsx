import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Building2, CalendarCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";

const GROUP_HERO_ASSET = "/manus-storage/evan-architectural-group-hero_73c5559f.png";

export default function FullWidthGroupHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[670px] overflow-hidden border-b border-primary/10 bg-[#edf8ff] sm:min-h-[690px] lg:min-h-[720px]">
      <motion.img
        src={GROUP_HERO_ASSET}
        alt="مشهد معماري تجريدي يمثل فروع مجموعة إيفان الطبية"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[28%_center] sm:object-[34%_center] lg:object-center"
        initial={false}
        animate={reduceMotion ? undefined : { scale: [1.01, 1.065, 1.01], x: [-18, 18, -18], y: [-7, 10, -7], rotate: [-0.3, 0.3, -0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-l from-white via-white/78 to-primary/5 lg:via-white/46 lg:to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 -z-10 bg-gradient-to-t from-white/88 to-transparent" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-[40%] -z-10 w-[35%] bg-gradient-to-r from-transparent via-white/55 to-transparent blur-2xl"
        animate={reduceMotion ? undefined : { x: ["0vw", "170vw"] }}
        transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[2%] -z-10 h-48 w-[36%] rounded-t-[48%] border border-primary/10 bg-sky-100/10"
        animate={reduceMotion ? undefined : { x: [-8, 18, -8], y: [0, -12, 0], opacity: [0.35, 0.72, 0.35] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-14 left-[6%] hidden h-24 w-24 rounded-3xl border border-primary/15 bg-white/15 backdrop-blur-sm lg:block"
        animate={reduceMotion ? undefined : { x: [-10, 15, -10], y: [0, -18, 0], rotate: [-3, 4, -3] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container flex min-h-[670px] items-end py-8 sm:min-h-[690px] sm:py-12 lg:min-h-[720px] lg:items-center lg:py-20">
        <div className="w-full max-w-xl rounded-[1.75rem] border border-white/60 bg-white/78 p-6 text-right shadow-xl shadow-primary/10 backdrop-blur-md sm:p-8 lg:mr-0 lg:ml-auto lg:max-w-2xl lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-3 py-1.5 text-xs font-extrabold text-primary shadow-sm">
            <Building2 className="size-3.5" />
            مجموعة إيفان الطبية — ثلاث فروع في الرياض
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.14] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            رعاية متكاملة،
            <span className="mt-2 block text-primary">أقرب إلى احتياجك.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-8 text-slate-600 sm:text-lg">
            منظومة طبية تجمع التخصصات والفروع وتجربة حجز موحّدة، لتصل إلى الخدمة والطبيب والموعد المناسب من مكان واحد.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/booking" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-extrabold text-accent-foreground shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              <CalendarCheck className="size-4" />
              احجز موعدك الآن
            </Link>
            <a href="#branches" className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white/85 px-6 py-3.5 text-sm font-extrabold text-primary shadow-sm transition-all duration-200 hover:border-primary/35 hover:shadow-md">
              استكشف فروعنا
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
