import { Link, useRoute } from "wouter";
import { ArrowUpLeft, CalendarCheck, CheckCircle2, Clock3, MapPin, Navigation, Sparkles } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { CLINIC, DEPARTMENTS, getBranchBySlug, LOGO_SRC } from "@/lib/clinic";

const BENEFITS = [
  "موقع واضح وسهل الوصول",
  "تخصصات طبية متكاملة",
  "حجز رقمي مباشر",
];

export default function BranchLanding() {
  const [, params] = useRoute("/go/:slug");
  const branch = getBranchBySlug(params?.slug);

  if (!branch) return <NotFound />;

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
            <img src={branch.image} alt={branch.imageAlt} className="size-full object-cover object-center opacity-45" />
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
                <Link
                  href={branch.bookingPath}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-sm font-extrabold text-accent-foreground shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97]"
                >
                  <CalendarCheck className="size-5" />
                  احجز موعدك الآن
                </Link>
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-extrabold text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
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
            <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground"><Clock3 className="size-5" /></span>
            <h2 className="mt-5 text-xl font-extrabold text-foreground">ابدأ الحجز في أقل من دقيقة</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">اختر الخدمة، ثم الموعد المناسب لك في هذا الفرع.</p>
            <Link href={branch.bookingPath} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline">
              ابدأ الحجز <ArrowUpLeft className="size-4" />
            </Link>
          </div>
        </section>

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
        <Link href={branch.bookingPath} className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-extrabold text-accent-foreground shadow-md active:scale-[0.97]">
          <CalendarCheck className="size-5" />
          احجز موعدك الآن
        </Link>
      </div>

      <footer className="bg-white px-5 py-7 text-center text-xs font-medium text-muted-foreground sm:px-7">
        {CLINIC.name}
      </footer>
    </div>
  );
}
