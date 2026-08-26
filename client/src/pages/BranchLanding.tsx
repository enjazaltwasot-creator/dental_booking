import { useRoute } from "wouter";
import { CheckCircle2, MapPin, MessageCircle, Navigation, Phone, Sparkles } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { CLINIC, DEPARTMENTS, getBranchBySlug, LOGO_SRC } from "@/lib/clinic";
import { BRANCH_CASES, BRANCH_DOCTORS, LANDING_CONTACTS, NATIONAL_DAY_OFFERS } from "@/lib/landingCampaign";

const BENEFITS = [
  "موقع واضح وسهل الوصول",
  "تخصصات طبية متكاملة",
  "تواصل مباشر مع الفرع",
];

export default function BranchLanding() {
  const [, params] = useRoute("/go/:slug");
  const branch = getBranchBySlug(params?.slug);

  if (!branch) return <NotFound />;

  const contact = LANDING_CONTACTS[branch.slug];
  const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`مرحباً، أرغب بالاستفسار عن عروض ${branch.name}.`)}`;
  const cases = BRANCH_CASES[branch.slug] ?? [];
  const doctors = BRANCH_DOCTORS[branch.slug] ?? [];

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-foreground">
      <header className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-7">
          <img src={LOGO_SRC} alt={CLINIC.name} className="h-9 w-auto object-contain sm:h-10" />
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-extrabold text-primary">
            <MapPin className="size-3.5" />
            {branch.city}
          </span>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-primary">
          <div className="absolute inset-0">
            <img src={branch.image} alt={branch.imageAlt} fetchPriority="high" decoding="async" className="size-full object-cover object-center opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/90 to-primary/55" />
          </div>
          <div className="pointer-events-none absolute -left-28 top-8 size-72 rounded-full border-[34px] border-white/10" />
          <div className="relative mx-auto grid min-h-[510px] max-w-6xl content-center px-5 py-14 sm:px-7 lg:min-h-[560px] lg:py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold text-white/90 ring-1 ring-white/20">
                <Sparkles className="size-3.5 text-orange-200" />
                مجموعة عيادات إيفان الطبية
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.22] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {branch.name}
              </h1>
              <p className="mt-4 max-w-xl text-base font-medium leading-8 text-white/85 sm:text-lg">
                {branch.address}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-sm font-extrabold text-accent-foreground shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97]"
                >
                  <MessageCircle className="size-5" />
                  راسلنا على واتساب
                </a>
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-extrabold text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
                >
                  <Phone className="size-5" />
                  اتصل الآن
                </a>
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white/12 px-6 text-sm font-extrabold text-white ring-1 ring-white/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 active:scale-[0.97]"
                >
                  <Navigation className="size-5" />
                  افتح الاتجاهات
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-5 py-8 sm:px-7 lg:grid-cols-[1.2fr_0.8fr] lg:py-11">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><MapPin className="size-5" /></span>
              <div>
                <p className="text-xs font-bold text-muted-foreground">أقرب إلى احتياجك</p>
                <h2 className="mt-1 text-xl font-extrabold text-foreground">زيارة منظمة من أول خطوة</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="size-4 shrink-0 text-accent" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-orange-50 p-6 ring-1 ring-orange-100 sm:p-7">
            <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground"><MessageCircle className="size-5" /></span>
            <h2 className="mt-5 text-xl font-extrabold text-foreground">تواصل سريع مع الفرع</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">راسل الفرع عبر واتساب أو اتصل مباشرة للاستفسار عن الخدمات والعروض.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline">
              ابدأ المحادثة على واتساب <MessageCircle className="size-4" />
            </a>
          </div>
        </section>

        <section className="bg-slate-950 py-12 text-white sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-extrabold tracking-[0.16em] text-orange-300">عروض اليوم الوطني</p>
                <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">اختر العرض المناسب لك</h2>
              </div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-orange-300 hover:text-orange-200">استفسر عن العروض عبر واتساب</a>
            </div>
            <div className="mt-7 flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
              {NATIONAL_DAY_OFFERS.map((offer) => (
                <article key={offer.id} className="w-48 shrink-0 snap-start overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 sm:w-56">
                  <img src={offer.image} alt={offer.alt} loading="eager" decoding="async" className="aspect-[9/16] w-full object-cover" />
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 text-white/60">تُطبق شروط العرض وتُؤكد تفاصيل الخدمة والسعر مع الفرع قبل الإجراء.</p>
          </div>
        </section>

        {cases.length > 0 && (
          <section className="bg-slate-50 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-5 sm:px-7">
              <p className="text-xs font-extrabold tracking-[0.16em] text-primary">حالات قبل وبعد</p>
              <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">نتائج موثقة من الفرع</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {cases.map((item) => (
                  <figure key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                    <img src={item.image} alt={item.alt} loading="eager" decoding="async" className="aspect-[4/3] w-full object-cover" />
                    <figcaption className="p-4 text-sm font-extrabold text-foreground">{item.title}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-muted-foreground">النتائج تختلف من حالة لأخرى، ويحدد الطبيب الخطة المناسبة بعد التقييم.</p>
            </div>
          </section>
        )}

        {doctors.length > 0 && (
          <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-5 sm:px-7">
              <p className="text-xs font-extrabold tracking-[0.16em] text-primary">فريق الفرع</p>
              <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">تعرف على الأطباء</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {doctors.map((doctor) => (
                  <article key={doctor.id} className="overflow-hidden rounded-3xl bg-slate-50 ring-1 ring-slate-200">
                    {doctor.image ? (
                      <img src={doctor.image} alt={doctor.alt ?? doctor.name} loading="eager" decoding="async" className="aspect-[4/5] w-full object-cover object-top" />
                    ) : (
                      <div className="grid aspect-[4/5] place-items-center bg-gradient-to-br from-primary to-sky-500 text-5xl font-black text-white/90" aria-hidden="true">
                        {`د. ${doctor.name.replace(/^د\.\s*/, "").split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join(" ")}`}
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-extrabold text-foreground">{doctor.name}</h3>
                      <p className="mt-1 text-sm font-bold text-primary">{doctor.specialty}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-7 sm:px-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-accent">التخصصات المتاحة</p>
              <h2 className="mt-1 text-xl font-extrabold text-foreground">رعاية متعددة التخصصات في مكان واحد</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((department) => <span key={department} className="rounded-full bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground">{department}</span>)}
            </div>
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-extrabold text-accent-foreground shadow-md active:scale-[0.97]">
          <MessageCircle className="size-5" />
          راسلنا على واتساب
        </a>
      </div>

      <footer className="bg-white px-5 py-7 text-center text-xs font-medium text-muted-foreground sm:px-7">
        {CLINIC.name}
      </footer>
    </div>
  );
}
