import { ArrowLeft, Building2, CalendarCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { HERO_VIDEO_SRC, LOGO_SRC } from "@/lib/clinic";

function AnimatedWords({ text, delay = 0, step = 0.075 }: { text: string; delay?: number; step?: number }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span aria-label={text} className="inline">
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block"
          initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(5px)" }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.42, delay: delay + index * step, ease: [0.23, 1, 0.32, 1] }}
        >
          {word}{index < words.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

export default function FullWidthGroupHero() {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  function updateTilt(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse" || window.innerWidth < 1024) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((event.clientY - rect.top) / rect.height) * 100;
    setTilt({ x: (pointerX / 100 - 0.5) * 3, y: (pointerY / 100 - 0.5) * 2 });
    setGlow({ x: pointerX, y: pointerY, active: true });
  }

  return (
    <section className="relative isolate min-h-[670px] overflow-hidden border-b border-primary/10 bg-slate-100 sm:min-h-[690px] lg:min-h-[720px]">
      <video autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 z-0 h-full w-full object-cover brightness-[1.22] saturate-110" aria-label="منظر طبيعي متحرك في خلفية الافتتاحية">
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/65 lg:bg-gradient-to-l lg:from-slate-950/78 lg:via-slate-950/42 lg:to-transparent" />

      <div className="container relative z-10 flex min-h-[670px] items-end py-8 sm:min-h-[690px] sm:py-12 lg:min-h-[720px] lg:items-center lg:py-20" style={{ perspective: "1100px" }}>
        <div
          className="relative w-full max-w-xl text-right sm:max-w-2xl lg:mr-0 lg:ml-auto"
          onPointerMove={updateTilt}
          onPointerLeave={() => {
            setTilt({ x: 0, y: 0 });
            setGlow({ x: 50, y: 50, active: false });
          }}
          style={{
            transform: `rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg) translateZ(0)`,
            transition: "transform 180ms cubic-bezier(0.23, 1, 0.32, 1)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-12 z-0"
            style={{
              background: `radial-gradient(280px circle at ${glow.x}% ${glow.y}%, rgba(56,189,248,0.22), rgba(249,115,22,0.06) 38%, transparent 70%)`,
              opacity: glow.active && !reduceMotion ? 1 : 0,
              transition: "opacity 220ms ease-out, background 120ms ease-out",
            }}
          />

          <div className="relative z-10">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: -12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-slate-950/30 p-1.5 pl-4 shadow-lg shadow-slate-950/20 backdrop-blur-md">
              <span className="grid h-11 w-20 place-items-center rounded-xl bg-white/95 p-1.5 shadow-sm sm:w-24">
                <img src={LOGO_SRC} alt="شعار مجموعة عيادات إيفان الطبية" className="h-full w-full object-contain" />
              </span>
              <span className="border-r border-white/20 pr-3 text-xs font-extrabold text-white sm:text-sm">مجموعة إيفان الطبية<br /><span className="font-semibold text-sky-100/85">ثلاث فروع في الرياض</span></span>
            </motion.div>

            <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }} className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.13] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(2,6,23,0.7)] sm:text-5xl lg:text-6xl">
              <AnimatedWords text="رعاية متكاملة،" delay={0.16} />
              <span className="mt-2 block text-sky-200"><AnimatedWords text="أقرب إلى احتياجك." delay={0.36} /></span>
            </motion.h1>

            <motion.p initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.48, delay: 0.46, ease: [0.23, 1, 0.32, 1] }} className="mt-6 max-w-xl border-r-2 border-accent pr-4 text-[15px] font-semibold leading-8 text-white/95 drop-shadow-[0_2px_12px_rgba(2,6,23,0.72)] sm:text-lg">
              <AnimatedWords text="منظومة طبية تجمع التخصصات والفروع وتجربة حجز موحّدة، لتصل إلى الخدمة والطبيب والموعد المناسب من مكان واحد." delay={0.54} step={0.035} />
            </motion.p>

            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.92, ease: [0.23, 1, 0.32, 1] }} className="mt-8 flex flex-wrap gap-3">
              <Link href="/booking" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-extrabold text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
                <CalendarCheck className="size-4" />
                احجز موعدك الآن
              </Link>
              <a href="#branches" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/95 px-6 py-3.5 text-sm font-extrabold text-primary shadow-lg shadow-slate-950/15 transition-all duration-200 hover:bg-white hover:shadow-xl">
                استكشف فروعنا
                <ArrowLeft className="size-4" />
              </a>
            </motion.div>

            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 1.04, ease: [0.23, 1, 0.32, 1] }} className="mt-8 grid max-w-md grid-cols-3 divide-x divide-x-reverse divide-white/15 rounded-2xl border border-white/20 bg-slate-950/25 p-3 shadow-lg shadow-slate-950/15 backdrop-blur-md">
              <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-orange-200">3</strong><span className="mt-1 block text-[11px] font-extrabold text-white/90">فروع في الرياض</span></div>
              <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-orange-200">3</strong><span className="mt-1 block text-[11px] font-extrabold text-white/90">مجالات تخصصية</span></div>
              <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-orange-200">1</strong><span className="mt-1 block text-[11px] font-extrabold text-white/90">رحلة حجز موحّدة</span></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
