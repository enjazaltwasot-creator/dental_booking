import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CalendarCheck, Check, Pause, Play, Sparkles, Stethoscope } from "lucide-react";
import PageShell from "@/components/PageShell";
import { trpc } from "@/lib/trpc";
import { SPECIALTIES } from "@/lib/clinic";
import { cn } from "@/lib/utils";

const CATEGORY_DISPLAY_MS = 6200;

const SPECIALTY_DETAILS = {
  dentistry: [
    { title: "زراعة الأسنان", text: "مسار منظم يبدأ بالتقييم الطبي لتحديد مدى ملاءمة خطة الزراعة واحتياج المراجع قبل الحجز.", label: "حلول تعويضية" },
    { title: "تقويم الأسنان", text: "تقييم لاصطفاف الأسنان وخيارات التقويم المناسبة، ثم تنسيق الموعد الأول ضمن الفرع المختار.", label: "تخطيط الابتسامة" },
    { title: "ابتسامة هوليود", text: "خيارات تجميلية للأسنان تُناقش مع الطبيب بعد تقييم الحالة والنتيجة المناسبة لاحتياج المراجع.", label: "تجميل الأسنان" },
    { title: "تركيبات الأسنان", text: "خدمات لتقييم التركيبات السنية الملائمة واستعادة المظهر والوظيفة وفق حالة المراجع.", label: "رعاية ترميمية" },
  ],
  "dermatology-aesthetics": [
    { title: "العناية بالجلد", text: "تقييم أولي لاحتياج البشرة ضمن بيئة طبية منظمة، ثم تحديد المسار المناسب مع الطبيب.", label: "رعاية شخصية" },
    { title: "استشارات تجميلية", text: "جلسة استشارة تتيح مناقشة الخيارات التجميلية المعلنة وتحديد الخطوة التالية بوضوح.", label: "قرار مدروس" },
    { title: "بروفايلو", text: "خيار مذكور ضمن الخدمات المعلنة سابقاً، ويخضع للتقييم الطبي لتحديد الملاءمة قبل أي إجراء.", label: "خدمة معلنة" },
  ],
  laser: [
    { title: "تقنيات الليزر", text: "تحديد نوع الخدمة المناسبة ضمن تقنيات الليزر المتاحة، مع توضيح الفرع والموعد قبل الحجز.", label: "تقنيات حديثة" },
    { title: "ليزر الرجال", text: "خدمة معلنة ضمن قسم الليزر، تُرتب عبر تنسيق واضح للخدمة والفرع والوقت المتاح.", label: "خدمة مخصصة" },
    { title: "تنسيق الموعد حسب الفرع", text: "يبدأ الحجز باختيار الفرع ثم الخدمة والطبيب والموعد، لتبقى الرحلة منظمة من البداية.", label: "حجز منظم" },
  ],
} as const;

const ORBIT_POSITIONS = [
  "lg:left-1/2 lg:top-4 lg:-translate-x-1/2",
  "lg:right-2 lg:top-1/2 lg:-translate-y-1/2",
  "lg:bottom-7 lg:left-1/2 lg:-translate-x-1/2",
  "lg:left-2 lg:top-1/2 lg:-translate-y-1/2",
];

export default function ServicesList() {
  const { data: services, isLoading } = trpc.services.list.useQuery();
  const [specialtyIndex, setSpecialtyIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const specialty = SPECIALTIES[specialtyIndex];
  const categories = SPECIALTY_DETAILS[specialty.id];
  const activeCategory = categories[categoryIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    setCategoryIndex(0);
  }, [specialtyIndex]);

  useEffect(() => {
    if (!autoPlay || reducedMotion) return;
    const timer = window.setTimeout(() => {
      setCategoryIndex(current => (current + 1) % categories.length);
    }, CATEGORY_DISPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoPlay, categoryIndex, categories.length, reducedMotion]);

  const selectSpecialty = (index: number) => {
    setSpecialtyIndex(index);
    setAutoPlay(false);
  };

  const selectCategory = (index: number) => {
    setCategoryIndex(index);
    setAutoPlay(false);
  };

  return (
    <PageShell>
      <section className="border-b border-border bg-secondary/30 py-12 sm:py-14">
        <div className="container text-center">
          <span className="rise-in inline-flex rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-extrabold text-primary">تخصصات مجموعة إيفان الطبية</span>
          <h1 className="rise-in mt-4 text-3xl font-extrabold text-foreground sm:text-4xl" style={{ animationDelay: "80ms" }}>التخصص في المركز، والتفاصيل حوله</h1>
          <p className="rise-in mx-auto mt-3 max-w-2xl text-[15px] leading-8 text-muted-foreground" style={{ animationDelay: "150ms" }}>استكشف بنود كل تخصص بالتتابع؛ نمنح كل بند وقتاً كافياً لعرض شرحه وصورته قبل الانتقال إلى البند التالي.</p>
        </div>
      </section>

      <section className="bg-white py-8 lg:py-10">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="التخصصات الطبية">
            {SPECIALTIES.map((item, index) => (
              <button key={item.id} type="button" role="tab" aria-selected={specialtyIndex === index} onClick={() => selectSpecialty(index)} className={cn("rounded-full border px-4 py-2 text-sm font-extrabold transition-all duration-200", specialtyIndex === index ? "border-accent bg-accent text-accent-foreground shadow-sm" : "border-primary/15 bg-white text-primary hover:border-primary/35 hover:bg-primary/5")}>
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/35 py-4 sm:py-7">
        <div className="container">
          <article onMouseEnter={() => setAutoPlay(false)} className="relative isolate min-h-[calc(100svh-8rem)] overflow-hidden rounded-[2rem] border border-primary/15 bg-white shadow-xl shadow-primary/10">
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[56%] rounded-r-[999px] bg-primary lg:block" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_at_75%_18%,rgba(255,102,0,0.1),transparent_30%)]" />
            <div className="relative grid min-h-[calc(100svh-8rem)] lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
              <div className="order-2 p-6 sm:p-9 lg:order-1 lg:p-12">
                <div className="flex items-center gap-2 text-xs font-extrabold text-accent"><Sparkles className="size-4" /> {specialty.number} · {specialty.subtitle}</div>
                <h2 className="mt-4 text-4xl font-extrabold text-foreground sm:text-5xl">{specialty.title}</h2>
                <p className="mt-4 max-w-xl text-[15px] leading-8 text-muted-foreground">{specialty.description}</p>

                <div key={`${specialty.id}-${activeCategory.title}`} className="rise-in mt-8 rounded-3xl border border-primary/15 bg-white p-5 shadow-sm sm:p-6" style={{ animationDelay: "0ms" }}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-extrabold text-accent">{activeCategory.label}</span>
                    <span className="text-xs font-bold text-muted-foreground">{categoryIndex + 1} / {categories.length}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold text-foreground">{activeCategory.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-8 text-muted-foreground">{activeCategory.text}</p>
                  <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-secondary">
                    <img src={specialty.image} alt={`${activeCategory.title} ضمن ${specialty.title}`} className="h-36 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-44" />
                  </div>
                  <Link href="/booking" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-extrabold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">احجز في هذا المسار <ArrowLeft className="size-4" /></Link>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => setAutoPlay(value => !value)} className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-xs font-extrabold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground">
                    {autoPlay && !reducedMotion ? <Pause className="size-4" /> : <Play className="size-4" />}
                    {autoPlay && !reducedMotion ? "إيقاف العرض التلقائي" : "تشغيل العرض التلقائي"}
                  </button>
                  <span className="text-xs font-semibold text-muted-foreground">مدة العرض لكل تصنيف: 6 ثوانٍ تقريباً</span>
                </div>
              </div>

              <div className="order-1 relative min-h-[380px] overflow-hidden bg-primary px-5 py-10 lg:order-2 lg:min-h-[calc(100svh-8rem)] lg:bg-transparent">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,0.18),transparent_27%),radial-gradient(circle_at_50%_46%,rgba(255,102,0,0.34),transparent_47%)]" />
                <div className="relative mx-auto flex h-full max-w-md items-center justify-center lg:max-w-none">
                  <div className="pointer-events-none absolute size-[290px] rounded-full border border-dashed border-white/40 sm:size-[360px]" />
                  <div className="pointer-events-none absolute size-[210px] rounded-full border border-white/20 sm:size-[270px]" />
                  <div className="relative z-10 overflow-hidden rounded-full border-8 border-white/90 shadow-2xl shadow-slate-950/25 ring-8 ring-accent/30">
                    <img src={specialty.image} alt={specialty.imageAlt} className="size-40 object-cover sm:size-52" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/5 to-transparent" />
                    <span className="absolute inset-x-3 bottom-4 text-center text-sm font-extrabold text-white">{specialty.title}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                    {categories.map((category, index) => <button key={category.title} type="button" onClick={() => selectCategory(index)} className={cn("shrink-0 rounded-full border px-3 py-2 text-xs font-extrabold transition-all", categoryIndex === index ? "border-accent bg-accent text-accent-foreground" : "border-white/40 bg-white/15 text-white")}>{category.title}</button>)}
                  </div>

                  <div className="absolute inset-0 hidden lg:block">
                    {categories.map((category, index) => (
                      <button key={category.title} type="button" onClick={() => selectCategory(index)} className={cn("absolute z-20 flex w-40 items-center gap-2 rounded-2xl border px-3 py-3 text-right text-xs font-extrabold shadow-lg transition-all duration-300", ORBIT_POSITIONS[index], categoryIndex === index ? "scale-110 border-accent bg-accent text-accent-foreground shadow-accent/30" : "border-white/35 bg-white/15 text-white hover:bg-white/25")}>
                        <span className={cn("grid size-6 shrink-0 place-items-center rounded-full", categoryIndex === index ? "bg-white/25" : "bg-accent text-accent-foreground")}><Check className="size-3.5" /></span>
                        <span>{category.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/25 py-16">
        <div className="container">
          <div className="mb-8 max-w-2xl"><span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"><CalendarCheck className="size-4" /> خدمات الحجز في قسم الأسنان</span><h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">اختر الخدمة السنية ثم انتقل إلى الطبيب والموعد</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">الخدمات أدناه تعكس الخيارات المعلنة في قسم الأسنان؛ سيظهر لك الوقت المتاح ضمن نموذج الحجز.</p></div>
          {isLoading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4, 5].map(item => <div key={item} className="h-52 animate-pulse rounded-2xl border border-border bg-secondary/50" />)}</div>}
          {!isLoading && (services?.length ?? 0) === 0 && <p className="py-16 text-center text-muted-foreground">لا توجد خدمات متاحة حالياً.</p>}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{(services ?? []).map(service => <article key={service.id} className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"><span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"><Stethoscope className="size-5" /></span><h2 className="mt-5 text-lg font-bold text-foreground">{service.name}</h2><p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{service.description}</p><div className="mt-5 flex items-center justify-end border-t border-border pt-4"><Link href="/booking" className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all duration-200 hover:shadow-md">انتقل للحجز</Link></div></article>)}</div>
        </div>
      </section>
    </PageShell>
  );
}
