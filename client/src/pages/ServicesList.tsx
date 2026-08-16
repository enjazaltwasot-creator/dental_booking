import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import PageShell from "@/components/PageShell";
import { cn } from "@/lib/utils";

const SLIDE_DURATION = 4000;

const SHOWCASE_SLIDES = [
  {
    id: "dental",
    node: "طب الأسنان",
    eyebrow: "رعاية سنية متكاملة",
    title: "طب الأسنان",
    description: "رحلة منظمة تجمع التشخيص والعلاج والتجميل ضمن مسار حجز واضح يبدأ بالفرع وينتهي بالموعد المناسب.",
    features: ["فحص وتقييم أولي", "تنسيق الفرع والطبيب", "مسار حجز واضح"],
    image: "/manus-storage/services-overview_66815dcd.jpg",
    imageAlt: "طبيب يجري فحصاً للأسنان داخل عيادة",
  },
  {
    id: "implants",
    node: "زراعة الأسنان",
    eyebrow: "حلول تعويضية",
    title: "زراعة الأسنان",
    description: "يبدأ المسار بتقييم الحاجة وخطة الرعاية مع الطبيب، ثم يحدد الفرع والموعد الملائمين للمراجع.",
    features: ["تقييم طبي مبدئي", "خطة رعاية متدرجة", "متابعة منظمة"],
    image: "/manus-storage/services-overview_66815dcd.jpg",
    imageAlt: "رعاية سنية داخل عيادة إيفان",
  },
  {
    id: "orthodontics",
    node: "تقويم الأسنان",
    eyebrow: "تخطيط الابتسامة",
    title: "تقويم الأسنان",
    description: "تقييم اصطفاف الأسنان وخيارات التقويم المتاحة، ثم الانتقال مباشرة إلى خطوة حجز منظمة.",
    features: ["تقييم الحالة", "مناقشة الخيارات", "اختيار الموعد"],
    image: "/manus-storage/services-overview_66815dcd.jpg",
    imageAlt: "طبيب أسنان ومراجع داخل العيادة",
  },
  {
    id: "dermatology",
    node: "الجلدية والتجميل",
    eyebrow: "عناية منظمة بالبشرة",
    title: "الجلدية والتجميل",
    description: "خيارات للعناية بالجلد والتجميل ضمن بيئة طبية منظمة، تبدأ باستشارة لتحديد المسار المناسب.",
    features: ["عناية بالجلد", "استشارات تجميلية", "خدمات معلنة"],
    image: "/manus-storage/clinic-care_9c78a4bb.jpg",
    imageAlt: "جلسة عناية تجميلية داخل بيئة طبية",
  },
  {
    id: "laser",
    node: "تقنيات الليزر",
    eyebrow: "تقنيات حديثة",
    title: "تقنيات الليزر",
    description: "تنسيق دقيق للخدمة والفرع والموعد المناسب ضمن تقنيات الليزر المعلنة للمجموعة.",
    features: ["تقنيات ليزر", "خدمات مخصصة", "تنسيق حسب الفرع"],
    image: "/manus-storage/laser-care-neutral_0fe7d79f.png",
    imageAlt: "مراجع يرتدي نظارات واقية خلال جلسة ليزر داخل عيادة",
  },
] as const;

const NODE_POSITIONS = [
  "left-1/2 top-[7%] -translate-x-1/2",
  "right-[11%] top-[26%]",
  "right-[3%] top-[56%]",
  "left-[3%] top-[56%]",
  "left-[11%] top-[26%]",
];

export default function ServicesList() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);
  const activeSlide = SHOWCASE_SLIDES[activeIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setProgress(0);
    if (!autoPlay || reducedMotion) return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
      setProgress(nextProgress);
      if (elapsed >= SLIDE_DURATION) {
        setActiveIndex(index => (index + 1) % SHOWCASE_SLIDES.length);
      }
    }, 80);

    return () => window.clearInterval(timer);
  }, [activeIndex, autoPlay, reducedMotion]);

  const selectSlide = (index: number) => {
    setActiveIndex(index);
    setAutoPlay(false);
  };

  const goToPrevious = () => {
    setActiveIndex(index => (index - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setActiveIndex(index => (index + 1) % SHOWCASE_SLIDES.length);
    setAutoPlay(false);
  };

  return (
    <PageShell>
      <section className="bg-[#0f172a] py-6 text-white sm:py-10">
        <div className="container">
          <div className="mb-7 text-center sm:mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-extrabold text-cyan-200"><Sparkles className="size-3.5" /> تخصصات إيفان في عرض تفاعلي</span>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">اختر الخدمة، ثم استكشف تفاصيلها</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-8 text-slate-300">تتحرك الشرائح تلقائياً كل أربع ثوانٍ، ويمكنك اختيار أي نقطة أو استخدام أدوات التنقل لقراءة التفاصيل بالوتيرة التي تناسبك.</p>
          </div>

          <article className="relative isolate min-h-[690px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#111d34] shadow-2xl shadow-slate-950/50 lg:min-h-[720px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_82%,rgba(14,165,233,0.18),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(255,102,0,0.14),transparent_28%)]" />
            <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full border border-cyan-200/10" />
            <div className="pointer-events-none absolute -bottom-52 -left-44 size-[34rem] rounded-full border border-cyan-200/10" />

            <div className="relative grid min-h-[690px] lg:grid-cols-[0.95fr_1.05fr] lg:min-h-[720px]">
              <div className="relative order-2 p-5 sm:p-8 lg:order-1 lg:p-12">
                <div key={activeSlide.id} className="rise-in rounded-3xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-sm sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-orange-500/15 px-3 py-1.5 text-xs font-extrabold text-orange-300">{activeSlide.eyebrow}</span>
                    <span className="text-xs font-bold text-cyan-200">الشريحة {activeIndex + 1} / {SHOWCASE_SLIDES.length}</span>
                  </div>
                  <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">{activeSlide.title}</h2>
                  <p className="mt-4 text-sm leading-8 text-slate-300">{activeSlide.description}</p>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                    <img src={activeSlide.image} alt={activeSlide.imageAlt} className="h-44 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-52" />
                  </div>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                    {activeSlide.features.map(feature => <li key={feature} className="flex items-center gap-2 rounded-xl bg-cyan-300/5 px-3 py-2.5 text-xs font-bold text-slate-100"><Check className="size-4 shrink-0 text-cyan-300" />{feature}</li>)}
                  </ul>
                  <Link href="/booking" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-400">ابدأ الحجز <ArrowLeft className="size-4" /></Link>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={goToPrevious} aria-label="الشريحة السابقة" className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-cyan-100 transition-all hover:bg-cyan-300 hover:text-slate-950"><ChevronRight className="size-5" /></button>
                  <button type="button" onClick={goToNext} aria-label="الشريحة التالية" className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-cyan-100 transition-all hover:bg-cyan-300 hover:text-slate-950"><ChevronLeft className="size-5" /></button>
                  <button type="button" onClick={() => setAutoPlay(value => !value)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-extrabold text-white transition-all hover:bg-white/10">
                    {autoPlay && !reducedMotion ? <Pause className="size-4" /> : <Play className="size-4" />}
                    {autoPlay && !reducedMotion ? "إيقاف العرض" : "تشغيل العرض"}
                  </button>
                  <div className="h-1.5 min-w-28 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-orange-500 transition-[width] duration-100" style={{ width: `${autoPlay && !reducedMotion ? progress : 0}%` }} /></div>
                </div>
              </div>

              <div className="relative order-1 min-h-[360px] overflow-hidden p-5 sm:min-h-[430px] lg:order-2 lg:min-h-full">
                <svg className="pointer-events-none absolute inset-x-[6%] top-[5%] h-[68%] w-[88%]" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M 90 465 A 420 420 0 0 1 910 465" fill="none" stroke="rgba(103,232,249,0.48)" strokeWidth="2" strokeDasharray="10 12" />
                  <path d="M 135 465 A 375 375 0 0 1 865 465" fill="none" stroke="rgba(255,102,0,0.25)" strokeWidth="1" />
                </svg>

                {SHOWCASE_SLIDES.map((slide, index) => (
                  <button key={slide.id} type="button" onClick={() => selectSlide(index)} aria-label={`عرض ${slide.title}`} className={cn("absolute z-20 flex size-12 items-center justify-center rounded-full border-2 text-xs font-black transition-all duration-300 sm:size-14", NODE_POSITIONS[index], activeIndex === index ? "scale-125 border-orange-300 bg-orange-500 text-white shadow-[0_0_0_8px_rgba(255,102,0,0.14),0_0_28px_rgba(255,102,0,0.55)]" : "border-cyan-200/70 bg-slate-900/85 text-cyan-200 shadow-lg shadow-cyan-950/40 hover:scale-110 hover:border-cyan-100 hover:bg-cyan-300 hover:text-slate-950")}>{index + 1}</button>
                ))}

                <div className="absolute bottom-7 left-1/2 z-10 flex size-36 -translate-x-1/2 flex-col items-center justify-center rounded-full border border-cyan-200/50 bg-cyan-300/15 text-center shadow-[0_0_0_14px_rgba(34,211,238,0.06),0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md sm:bottom-10 sm:size-44">
                  <span className="text-xs font-bold text-cyan-200">المحور المركزي</span>
                  <span className="mt-1 px-3 text-sm font-extrabold leading-6 text-white">مجموعة إيفان الطبية</span>
                </div>
                <p className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-slate-400">اضغط على أي نقطة لعرض الخدمة</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
