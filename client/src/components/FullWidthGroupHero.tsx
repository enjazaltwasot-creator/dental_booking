import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Building2, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const NATURE_HERO_VIDEO = "/manus-storage/evan-natural-hero-day-extended_5ec37a01.mp4";

export default function FullWidthGroupHero() {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  function updateTilt(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse" || window.innerWidth < 1024) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((event.clientY - rect.top) / rect.height) * 100;
    const x = (pointerX / 100 - 0.5) * 5;
    const y = (pointerY / 100 - 0.5) * 4;
    setTilt({ x, y });
    setGlow({ x: pointerX, y: pointerY, active: true });
  }

  return (
    <section className="relative isolate min-h-[670px] overflow-hidden border-b border-primary/10 bg-slate-100 sm:min-h-[690px] lg:min-h-[720px]">
      <video autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 z-0 h-full w-full object-cover" aria-label="منظر طبيعي متحرك في خلفية الافتتاحية">
        <source src={NATURE_HERO_VIDEO} type="video/mp4" />
      </video>

      <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-l from-white/18 via-slate-950/4 to-slate-950/20" />

      <div className="container relative z-10 flex min-h-[670px] items-end py-8 sm:min-h-[690px] sm:py-12 lg:min-h-[720px] lg:items-center lg:py-20" style={{ perspective: "1100px" }}>
        <div
          className="relative w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/35 bg-white/8 p-6 text-right shadow-xl shadow-slate-950/20 backdrop-blur-[2px] sm:p-8 lg:mr-0 lg:ml-auto lg:max-w-2xl"
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
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] p-px"
            animate={reduceMotion ? undefined : { backgroundPosition: ["150% 0", "-150% 0"] }}
            transition={{ duration: 5.8, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.06) 46%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.06) 54%, transparent 62%)",
              backgroundSize: "260% 100%",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: `radial-gradient(260px circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.24), rgba(255,255,255,0.05) 30%, transparent 68%)`,
              opacity: glow.active && !reduceMotion ? 1 : 0,
              transition: "opacity 220ms ease-out, background 120ms ease-out",
            }}
          />
          <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/26 px-3 py-1.5 text-xs font-extrabold text-primary shadow-sm">
            <Building2 className="size-3.5" />
            مجموعة إيفان الطبية — ثلاث فروع في الرياض
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.14] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            رعاية متكاملة،
            <span className="mt-2 block text-primary">أقرب إلى احتياجك.</span>
          </h1>
          <p className="mt-5 max-w-xl rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-[15px] font-semibold leading-8 text-slate-950 shadow-[0_1px_0_rgba(255,255,255,0.72)] sm:text-lg">
            منظومة طبية تجمع التخصصات والفروع وتجربة حجز موحّدة، لتصل إلى الخدمة والطبيب والموعد المناسب من مكان واحد.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/booking" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-extrabold text-accent-foreground shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              <CalendarCheck className="size-4" />
              احجز موعدك الآن
            </Link>
            <a href="#branches" className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-6 py-3.5 text-sm font-extrabold text-primary shadow-sm transition-all duration-200 hover:border-primary/35 hover:shadow-md">
              استكشف فروعنا
              <ArrowLeft className="size-4" />
            </a>
          </div>
          <div className="mt-8 grid max-w-md grid-cols-3 divide-x divide-x-reverse divide-white/25 rounded-2xl border border-white/35 bg-white/18 p-3 shadow-sm backdrop-blur-[2px]">
            <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-primary">3</strong><span className="mt-1 block text-[11px] font-extrabold text-slate-900">فروع في الرياض</span></div>
            <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-primary">3</strong><span className="mt-1 block text-[11px] font-extrabold text-slate-900">مجالات تخصصية</span></div>
            <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-primary">1</strong><span className="mt-1 block text-[11px] font-extrabold text-slate-900">رحلة حجز موحّدة</span></div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
