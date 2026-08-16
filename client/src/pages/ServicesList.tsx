import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play, Sparkles, X } from "lucide-react";
import PageShell from "@/components/PageShell";
import { cn } from "@/lib/utils";

const DEFAULT_SLIDE_DURATION = 5600;

type StoryItem = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
  points: readonly string[];
};

type SpecialtyStory = {
  id: string;
  title: string;
  shortTitle: string;
  cover: string;
  items: readonly StoryItem[];
};

const SPECIALTY_STORIES: readonly SpecialtyStory[] = [
  {
    id: "dental",
    title: "طب الأسنان",
    shortTitle: "الأسنان",
    cover: "/manus-storage/services-overview_66815dcd.jpg",
    items: [
      { title: "طب الأسنان", eyebrow: "رعاية سنية متكاملة", description: "رحلة رعاية منظمة تجمع التقييم وخيارات العلاج والتجميل، ثم تنقلك بسلاسة إلى الفرع والطبيب والموعد المناسب.", image: "/manus-storage/services-overview_66815dcd.jpg", imageAlt: "طبيب يجري فحصاً للأسنان داخل عيادة", points: ["تقييم أولي", "تحديد المسار", "حجز واضح"] },
      { title: "زراعة الأسنان", eyebrow: "حلول تعويضية", description: "يبدأ المسار بتقييم الحاجة وخطة الرعاية مع الطبيب، قبل تنسيق الموعد المناسب في الفرع الذي تختاره.", image: "/manus-storage/services-overview_66815dcd.jpg", imageAlt: "رعاية سنية داخل عيادة إيفان", points: ["تقييم طبي", "خطة متدرجة", "متابعة منظمة"] },
      { title: "تقويم الأسنان", eyebrow: "تخطيط الابتسامة", description: "عرض منظم لخيارات التقويم مع تقييم اصطفاف الأسنان وتنسيق الخطوة الأولى للحجز.", image: "/manus-storage/services-overview_66815dcd.jpg", imageAlt: "طبيب أسنان ومراجع داخل العيادة", points: ["تقييم الحالة", "مناقشة الخيارات", "اختيار الموعد"] },
    ],
  },
  {
    id: "dermatology",
    title: "الجلدية والتجميل",
    shortTitle: "الجلدية",
    cover: "/manus-storage/clinic-care_9c78a4bb.jpg",
    items: [
      { title: "العناية بالجلد", eyebrow: "رعاية شخصية", description: "مسار استشارة أولية لتحديد احتياج البشرة ضمن بيئة طبية منظمة وتوضيح الخطوة التالية.", image: "/manus-storage/clinic-care_9c78a4bb.jpg", imageAlt: "جلسة عناية تجميلية داخل بيئة طبية", points: ["استشارة أولية", "تحديد الاحتياج", "موعد مناسب"] },
      { title: "استشارات تجميلية", eyebrow: "قرار مدروس", description: "جلسة تتيح مناقشة الخيارات التجميلية المعلنة وترتيب زيارة واضحة مع المختص.", image: "/manus-storage/clinic-care_9c78a4bb.jpg", imageAlt: "خدمة عناية داخل عيادة", points: ["خيارات معلنة", "توجيه متخصص", "تنسيق الزيارة"] },
      { title: "بروفايلو", eyebrow: "خدمة معلنة", description: "خدمة مدرجة ضمن التخصصات المعلنة، ويُحدد مدى ملاءمتها بعد التقييم الطبي داخل العيادة.", image: "/manus-storage/clinic-care_9c78a4bb.jpg", imageAlt: "عناية احترافية بالبشرة", points: ["تقييم ملاءمة", "شرح الإجراء", "موعد منظم"] },
    ],
  },
  {
    id: "laser",
    title: "تقنيات الليزر",
    shortTitle: "الليزر",
    cover: "/manus-storage/laser-care-neutral_0fe7d79f.png",
    items: [
      { title: "تقنيات الليزر", eyebrow: "تقنيات حديثة", description: "تنسيق واضح للخدمة والفرع والموعد ضمن تقنيات الليزر المتاحة في المجموعة.", image: "/manus-storage/laser-care-neutral_0fe7d79f.png", imageAlt: "جلسة ليزر داخل عيادة", points: ["خدمة مخصصة", "فرع مناسب", "وقت متاح"] },
      { title: "ليزر الرجال", eyebrow: "خدمة مخصصة", description: "خدمة معلنة ضمن قسم الليزر، ترتب عبر حجز منظم يوضح الفرع والوقت قبل تأكيد الموعد.", image: "/manus-storage/laser-care-neutral_0fe7d79f.png", imageAlt: "تقنيات ليزر طبية", points: ["خدمة معلنة", "ترتيب سهل", "تجربة منظمة"] },
      { title: "تنسيق الموعد حسب الفرع", eyebrow: "رحلة موحدة", description: "اختر الفرع ثم الخدمة والطبيب والموعد لتبدأ رحلة حجز موحدة وواضحة من مكان واحد.", image: "/manus-storage/laser-care-neutral_0fe7d79f.png", imageAlt: "رعاية طبية بتقنيات حديثة", points: ["اختيار الفرع", "تحديد الخدمة", "تأكيد الموعد"] },
    ],
  },
];

export default function ServicesList() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [seenStories, setSeenStories] = useState<string[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeStory = SPECIALTY_STORIES[storyIndex];
  const activeItem = activeStory.items[itemIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  const changeStory = (nextStory: number) => {
    setStoryIndex((nextStory + SPECIALTY_STORIES.length) % SPECIALTY_STORIES.length);
    setItemIndex(0);
    setProgress(0);
    setSeenStories(current => current.includes(SPECIALTY_STORIES[(nextStory + SPECIALTY_STORIES.length) % SPECIALTY_STORIES.length].id) ? current : [...current, SPECIALTY_STORIES[(nextStory + SPECIALTY_STORIES.length) % SPECIALTY_STORIES.length].id]);
  };

  const goNext = () => {
    if (itemIndex < activeStory.items.length - 1) {
      setItemIndex(index => index + 1);
      setProgress(0);
      return;
    }
    changeStory(storyIndex + 1);
  };

  const goPrevious = () => {
    if (itemIndex > 0) {
      setItemIndex(index => index - 1);
      setProgress(0);
      return;
    }
    const previousStory = (storyIndex - 1 + SPECIALTY_STORIES.length) % SPECIALTY_STORIES.length;
    setStoryIndex(previousStory);
    setItemIndex(SPECIALTY_STORIES[previousStory].items.length - 1);
    setProgress(0);
  };

  useEffect(() => {
    setSeenStories(current => current.includes(activeStory.id) ? current : [...current, activeStory.id]);
  }, [activeStory.id]);

  useEffect(() => {
    setProgress(0);
    if (isPaused || isHolding || reducedMotion) return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const nextProgress = Math.min(100, ((Date.now() - startedAt) / DEFAULT_SLIDE_DURATION) * 100);
      setProgress(nextProgress);
      if (nextProgress >= 100) goNext();
    }, 80);

    return () => window.clearInterval(timer);
  }, [storyIndex, itemIndex, isPaused, isHolding, reducedMotion]);

  const progressBars = useMemo(() => activeStory.items.map((_, index) => {
    if (index < itemIndex) return 100;
    if (index === itemIndex) return progress;
    return 0;
  }), [activeStory.items, itemIndex, progress]);

  return (
    <PageShell>
      <section className="min-h-[calc(100svh-5rem)] bg-[#0b1221] py-7 text-white sm:py-10">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-extrabold text-cyan-100"><Sparkles className="size-3.5" /> تخصصات إيفان</span>
                <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">استكشف التخصصات كقصة تفاعلية</h1>
              </div>
              <span className="text-xs font-bold text-slate-400">اضغط باستمرار لإيقاف العرض مؤقتاً</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3" role="tablist" aria-label="قصص التخصصات">
              {SPECIALTY_STORIES.map((story, index) => {
                const isActive = storyIndex === index;
                const isSeen = seenStories.includes(story.id);
                return (
                  <button key={story.id} type="button" role="tab" aria-selected={isActive} onClick={() => changeStory(index)} className="group shrink-0 text-center">
                    <span className={cn("relative block size-[68px] rounded-full p-[3px] transition-transform duration-300 group-hover:scale-105", isActive ? "bg-gradient-to-br from-orange-400 via-orange-500 to-cyan-300 shadow-[0_0_24px_rgba(255,102,0,0.38)]" : isSeen ? "bg-slate-600" : "bg-gradient-to-br from-cyan-300 to-primary") }>
                      <img src={story.cover} alt="" className="size-full rounded-full border-2 border-[#0b1221] object-cover" />
                      {isActive && <span className="absolute inset-0 rounded-full border-2 border-orange-200/80 animate-pulse" />}
                    </span>
                    <span className={cn("mt-2 block text-xs font-extrabold", isActive ? "text-orange-300" : "text-slate-300")}>{story.shortTitle}</span>
                  </button>
                );
              })}
            </div>

            <article
              className="relative mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-black/35"
              onPointerDown={() => setIsHolding(true)}
              onPointerUp={() => setIsHolding(false)}
              onPointerLeave={() => setIsHolding(false)}
              onPointerCancel={() => setIsHolding(false)}
            >
              <div className="absolute inset-x-5 top-5 z-20 flex gap-1.5 sm:inset-x-7 sm:top-7">
                {progressBars.map((value, index) => <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-orange-400 transition-[width] duration-100" style={{ width: `${value}%` }} /></div>)}
              </div>

              <div key={`${activeStory.id}-${activeItem.title}`} className="rise-in relative min-h-[620px] sm:min-h-[650px]">
                <img src={activeItem.image} alt={activeItem.imageAlt} className="absolute inset-0 h-full w-full object-cover opacity-45" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,31,0.96)_0%,rgba(8,15,31,0.84)_42%,rgba(8,15,31,0.18)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,102,0,0.28),transparent_30%),radial-gradient(circle_at_70%_86%,rgba(34,211,238,0.18),transparent_36%)]" />

                <div className="relative z-10 flex min-h-[620px] flex-col justify-end p-6 pt-24 sm:min-h-[650px] sm:p-10 sm:pt-28 lg:max-w-[64%] lg:p-14 lg:pt-32">
                  <span className="w-fit rounded-full border border-orange-300/25 bg-orange-500/15 px-3 py-1.5 text-xs font-extrabold text-orange-200">{activeItem.eyebrow}</span>
                  <div className="mt-5 flex items-center gap-3 text-xs font-bold text-cyan-200"><span>{activeStory.title}</span><span className="size-1 rounded-full bg-orange-400" /><span>{itemIndex + 1} من {activeStory.items.length}</span></div>
                  <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{activeItem.title}</h2>
                  <p className="mt-4 max-w-xl text-sm leading-8 text-slate-200 sm:text-base">{activeItem.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">{activeItem.points.map(point => <span key={point} className="rounded-xl border border-cyan-200/15 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-50">{point}</span>)}</div>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link href="/booking" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-400">ابدأ الحجز <ArrowLeft className="size-4" /></Link>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setIsPaused(value => !value); }} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-extrabold text-white backdrop-blur-sm transition hover:bg-white/20">
                      {isPaused || reducedMotion ? <Play className="size-4" /> : <Pause className="size-4" />}{isPaused || reducedMotion ? "تشغيل" : "إيقاف"}
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" onClick={goPrevious} aria-label="العنصر السابق" className="absolute right-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-slate-950/35 text-white backdrop-blur transition hover:bg-cyan-300 hover:text-slate-950 sm:right-6"><ChevronRight className="size-5" /></button>
              <button type="button" onClick={goNext} aria-label="العنصر التالي" className="absolute left-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-slate-950/35 text-white backdrop-blur transition hover:bg-cyan-300 hover:text-slate-950 sm:left-6"><ChevronLeft className="size-5" /></button>
              <button type="button" onClick={() => { setItemIndex(0); setProgress(0); }} className="absolute left-5 top-5 z-30 hidden size-8 place-items-center rounded-full bg-black/20 text-white/70 transition hover:bg-white/15 hover:text-white sm:grid" aria-label="إعادة القصة من البداية"><X className="size-4" /></button>
            </article>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
