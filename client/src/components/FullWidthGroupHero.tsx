import { ArrowLeft, Building2, CalendarCheck } from "lucide-react";
import { Link } from "wouter";

const NATURE_HERO_VIDEO = "/manus-storage/evan-natural-hero_24f8863d.mp4";

export default function FullWidthGroupHero() {
  return (
    <section className="relative isolate min-h-[670px] overflow-hidden border-b border-primary/10 bg-slate-100 sm:min-h-[690px] lg:min-h-[720px]">
      <video autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 -z-20 h-full w-full object-cover" aria-label="منظر طبيعي متحرك في خلفية الافتتاحية">
        <source src={NATURE_HERO_VIDEO} type="video/mp4" />
      </video>

      <div className="container flex min-h-[670px] items-end py-8 sm:min-h-[690px] sm:py-12 lg:min-h-[720px] lg:items-center lg:py-20">
        <div className="w-full max-w-xl rounded-[1.75rem] border border-white/55 bg-white/48 p-6 text-right shadow-xl shadow-slate-950/20 backdrop-blur-xl sm:p-8 lg:mr-0 lg:ml-auto lg:max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-primary shadow-sm">
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
            <a href="#branches" className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-6 py-3.5 text-sm font-extrabold text-primary shadow-sm transition-all duration-200 hover:border-primary/35 hover:shadow-md">
              استكشف فروعنا
              <ArrowLeft className="size-4" />
            </a>
          </div>
          <div className="mt-8 grid max-w-md grid-cols-3 divide-x divide-x-reverse divide-primary/10 rounded-2xl border border-primary/10 bg-slate-50 p-3 shadow-sm">
            <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-primary">3</strong><span className="mt-1 block text-[11px] font-bold text-slate-500">فروع في الرياض</span></div>
            <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-primary">3</strong><span className="mt-1 block text-[11px] font-bold text-slate-500">مجالات تخصصية</span></div>
            <div className="px-2 text-center"><strong className="block text-xl font-extrabold text-primary">1</strong><span className="mt-1 block text-[11px] font-bold text-slate-500">رحلة حجز موحّدة</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
