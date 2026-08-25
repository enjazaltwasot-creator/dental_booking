import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, ChevronLeft, Sparkles, Stethoscope } from "lucide-react";
import PageShell from "@/components/PageShell";
import { optimizedAsset } from "@/lib/clinic";

const SPECIALTIES = [
  {
    id: "dental",
    number: "01",
    eyebrow: "الرعاية السنية",
    title: "طب الأسنان",
    summary: "رعاية سنية منظمة تجمع التقييم وخيارات العلاج والتجميل، وتنتقل بك إلى الفرع والطبيب والموعد المناسب من مكان واحد.",
    image: optimizedAsset("services-overview_66815dcd.webp", "services-overview_66815dcd.jpg"),
    alt: "طبيب أسنان مع مراجع داخل عيادة",
    services: ["زراعة الأسنان", "تقويم الأسنان", "ابتسامة هوليود", "تركيبات الأسنان"],
    note: "ابدأ باختيار الفرع، ثم الخدمة والطبيب والموعد المتاح.",
  },
  {
    id: "dermatology",
    number: "02",
    eyebrow: "العناية بالبشرة",
    title: "الجلدية والتجميل",
    summary: "تخصص يركز على العناية الطبية بالبشرة والاستشارات التجميلية ضمن تجربة مريحة وواضحة قبل تحديد مسار الزيارة.",
    image: optimizedAsset("clinic-care_9c78a4bb.webp", "clinic-care_9c78a4bb.jpg"),
    alt: "جلسة عناية بالبشرة داخل بيئة طبية",
    services: ["العناية بالجلد", "استشارات تجميلية", "بروفايلو", "تقييم الاحتياج"],
    note: "تبدأ الزيارة باستشارة لتحديد الخطوة الملائمة وفق احتياج المراجع.",
  },
  {
    id: "laser",
    number: "03",
    eyebrow: "تقنيات حديثة",
    title: "تقنيات الليزر",
    summary: "مسار واضح لتنسيق خدمات الليزر المعلنة بحسب الخدمة والفرع والموعد، ضمن تجربة حجز موحدة ومباشرة.",
    image: optimizedAsset("laser-care-neutral_0fe7d79f.webp", "laser-care-neutral_0fe7d79f.png"),
    alt: "جلسة ليزر في عيادة طبية",
    services: ["تقنيات الليزر", "ليزر الرجال", "اختيار الفرع", "تنسيق الموعد"],
    note: "يعرض الحجز الخدمة والفرع والوقت قبل تثبيت الموعد.",
  },
] as const;

export default function ServicesList() {
  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-primary/10 bg-[#f6fbff] py-16 sm:py-24">
        <div className="pointer-events-none absolute -left-28 top-[-11rem] size-[31rem] rounded-full border-[40px] border-primary/5" />
        <div className="pointer-events-none absolute -right-20 bottom-[-12rem] size-[28rem] rounded-full border-[32px] border-accent/10" />
        <div className="container relative">
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-extrabold text-primary shadow-sm"><Sparkles className="size-3.5 text-accent" /> تخصصات مجموعة إيفان الطبية</span>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.3] text-[#0f2544] sm:text-5xl lg:text-6xl">كل تخصص يبدأ بخطوة رعاية واضحة.</h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-600 sm:text-base">اختر التخصص الأقرب لاحتياجك، ثم تعرّف على مسار الرعاية والخدمات المتاحة قبل الانتقال إلى الحجز.</p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-white/80 p-5 shadow-xl shadow-primary/5 backdrop-blur sm:p-6">
              <p className="text-xs font-extrabold tracking-[0.18em] text-primary">منظومة متكاملة</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {SPECIALTIES.map((specialty) => <a key={specialty.id} href={`#${specialty.id}`} className="group rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-md"><span className="text-xs font-extrabold text-accent">{specialty.number}</span><span className="mt-2 block text-xs font-bold text-primary group-hover:text-[#0f2544]">{specialty.title}</span></a>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-20">
        <div className="container space-y-12 sm:space-y-20">
          {SPECIALTIES.map((specialty, index) => (
            <article id={specialty.id} key={specialty.id} className="scroll-mt-24 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_50px_-30px_rgba(15,37,68,0.35)]">
              <div className={`grid lg:grid-cols-2 ${index % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                <div className="relative min-h-[300px] overflow-hidden sm:min-h-[380px]">
                  <img src={specialty.image} alt={specialty.alt} loading={index === 0 ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/15 to-transparent" />
                  <div className="absolute bottom-6 right-6 left-6 flex items-end justify-between text-white sm:bottom-8 sm:right-8 sm:left-8">
                    <div><span className="text-xs font-bold text-orange-200">{specialty.eyebrow}</span><p className="mt-2 text-3xl font-extrabold">{specialty.title}</p></div>
                    <span className="grid size-12 place-items-center rounded-2xl bg-accent text-lg font-extrabold shadow-lg shadow-orange-950/25">{specialty.number}</span>
                  </div>
                </div>
                <div className="p-7 sm:p-10 lg:p-12">
                  <span className="inline-flex items-center gap-2 text-xs font-extrabold text-primary"><Stethoscope className="size-4 text-accent" /> {specialty.eyebrow}</span>
                  <h2 className="mt-4 text-3xl font-extrabold text-[#0f2544] sm:text-4xl">{specialty.title}</h2>
                  <p className="mt-5 max-w-xl text-sm leading-8 text-slate-600 sm:text-[15px]">{specialty.summary}</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {specialty.services.map((service) => <div key={service} className="flex items-center gap-2 rounded-xl border border-primary/10 bg-[#f8fbfe] px-3 py-3 text-sm font-bold text-primary"><CheckCircle2 className="size-4 shrink-0 text-accent" />{service}</div>)}
                  </div>
                  <div className="mt-7 border-r-2 border-accent pr-4 text-sm leading-7 text-slate-500">{specialty.note}</div>
                  <div className="mt-8 flex flex-wrap gap-3"><Link href="/booking" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#143b70] hover:shadow-lg hover:shadow-primary/20">احجز ضمن هذا التخصص <ArrowLeft className="size-4" /></Link><Link href="/branches" className="inline-flex items-center gap-2 rounded-xl border border-primary/15 px-5 py-3 text-sm font-extrabold text-primary transition-colors hover:bg-primary/5">اختر الفرع <ArrowLeft className="size-4" /></Link></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/10 bg-[#0f2544] py-14 text-white sm:py-16">
        <div className="container flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div><p className="text-sm font-extrabold text-orange-300">مسار حجز موحّد</p><h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">اختر التخصص، ثم نساعدك للوصول إلى الموعد المناسب.</h2></div>
          <Link href="/booking" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-950/25">ابدأ الحجز الآن <ChevronLeft className="size-4" /></Link>
        </div>
      </section>
    </PageShell>
  );
}
