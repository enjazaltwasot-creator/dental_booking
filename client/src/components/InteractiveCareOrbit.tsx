import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const ORBIT_ASSET = "/manus-storage/evan-3d-care-orbit_e6f66c40.png";

type Tilt = { x: number; y: number };

export default function InteractiveCareOrbit() {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x: y, y: x });
  }

  return (
    <div
      className="group relative isolate overflow-hidden rounded-[2rem] bg-primary p-5 text-primary-foreground shadow-xl shadow-primary/15 sm:p-7"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ perspective: "1100px" }}
    >
      <div className="pointer-events-none absolute -left-16 -top-20 size-56 rounded-full border-[30px] border-white/10" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-accent/90 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
        <span className="text-xs font-bold tracking-[0.2em] text-white/70">EVAN MEDICAL GROUP</span>
        <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/85">3D CARE EXPERIENCE</span>
      </div>

      <motion.div
        className="relative h-[245px] sm:h-[280px]"
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.span
            aria-hidden="true"
            className="absolute left-[8%] top-[18%] h-[65%] w-[84%] rounded-[50%] border border-sky-100/45"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            style={{ transform: "rotateX(67deg) rotateZ(-12deg) translateZ(18px)" }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute left-[16%] top-[28%] h-[44%] w-[70%] rounded-[50%] border-2 border-orange-300/75"
            animate={reduceMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ transform: "rotateX(68deg) rotateZ(18deg) translateZ(28px)" }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute left-[13%] top-[18%] size-3 rounded-full bg-orange-300 shadow-[0_0_24px_rgba(253,186,116,0.9)]"
            animate={reduceMotion ? undefined : { x: [0, 130, 0], y: [0, 46, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translateZ(45px)" }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-[22%] right-[16%] size-2.5 rounded-full bg-white shadow-[0_0_22px_rgba(255,255,255,0.9)]"
            animate={reduceMotion ? undefined : { x: [0, -86, 0], y: [0, -42, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{ transform: "translateZ(55px)" }}
          />
          <motion.img
            src={ORBIT_ASSET}
            alt="مجسم ثلاثي الأبعاد متحرك يرمز إلى رحلة الرعاية المتصلة"
            className="absolute inset-0 h-full w-full object-contain drop-shadow-2xl"
            animate={reduceMotion ? undefined : { rotate: [0, 1.5, 0, -1.5, 0], scale: [1, 1.025, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translateZ(38px)" }}
          />
        </div>
        <span className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/20 bg-primary/70 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-white/90 backdrop-blur-sm">
          حرّك المؤشر لاستكشاف المشهد
        </span>
      </motion.div>

      <div className="relative z-10 border-t border-white/15 pt-5">
        <p className="text-sm font-semibold text-white/70">رؤيتنا في الرعاية</p>
        <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">منظومة صحية إنسانية، قريبة، ومتصلة.</h2>
        <p className="mt-3 text-sm leading-7 text-white/75">صفحة واحدة تفتح لك الطريق إلى فروع المجموعة وخدماتها وفريقها الطبي.</p>
      </div>
    </div>
  );
}
