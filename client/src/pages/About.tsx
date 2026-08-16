import { Link } from "wouter";
import { ArrowLeft, Building2, CalendarCheck, MapPin, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import PageShell from "@/components/PageShell";
import { BRANCHES, CLINIC } from "@/lib/clinic";

const VALUES = [
  { icon: Stethoscope, title: "رعاية مترابطة", text: "نجمع تخصصات الأسنان والجلدية والليزر ضمن مسار واضح للزيارة والحجز." },
  { icon: MapPin, title: "وصول أقرب", text: "ثلاثة فروع داخل الرياض تساعدك على اختيار الموقع الأنسب لاحتياجك." },
  { icon: ShieldCheck, title: "تجربة منظمة", text: "تبدأ رحلتك من الخدمة والفرع، ثم تنتقل إلى الطبيب والموعد ضمن خطوات بسيطة." },
];

export default function About() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-primary py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute -right-24 -top-20 size-72 rounded-full border-[42px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 size-64 rounded-full bg-accent/50 blur-3xl" />
        <div className="container relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-orange-200">
              <Building2 className="size-3.5" />
              عن المجموعة
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
              رعاية متعددة التخصصات، ضمن منظومة أقرب إلى احتياجك.
            </h1>
          </div>
          <p className="max-w-xl text-[15px] leading-8 text-white/80">
            {CLINIC.name} هي منصة رعاية تجمع تخصصات الأسنان والجلدية والليزر، وتربط الفروع والتخصصات والحجز في تجربة رقمية موحّدة.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="rounded-[2rem] border border-primary/10 bg-secondary/55 p-7 sm:p-9">
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-primary shadow-sm"><Sparkles className="size-5" /></span>
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-foreground">ما الذي يجمع فروع إيفان؟</h2>
            <p className="mt-4 text-[15px] leading-8 text-muted-foreground">
              نعمل على أن تكون رحلة المراجع مفهومة من أول خطوة: تعرف التخصص، تختار الفرع، ثم تنظم موعدك من مساحة واحدة.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {VALUES.map(value => (
              <article key={value.title} className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><value.icon className="size-5" /></span>
                <h3 className="mt-6 text-lg font-extrabold text-foreground">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-secondary/40 py-16 lg:py-20">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.17em] text-accent">نطاق المجموعة</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">ثلاثة فروع، ومسار واحد للحجز.</h2>
            <p className="mt-4 text-[15px] leading-8 text-muted-foreground">اختر الفرع الذي يناسب موقعك، ثم ابدأ الحجز منه مباشرةً.</p>
          </div>
          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {BRANCHES.map((branch, index) => (
              <Link key={branch.slug} href={branch.route} className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="size-5" /></span>
                  <span className="text-xs font-extrabold text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-7 text-xl font-extrabold text-foreground">{branch.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{branch.city}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary transition-transform duration-200 group-hover:-translate-x-1">
                  استكشف الفرع <ArrowLeft className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 pt-16">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-primary to-[#0a497e] px-7 py-12 text-center text-white shadow-lg shadow-primary/15 sm:px-12">
            <div className="pointer-events-none absolute -left-14 top-1/2 size-48 -translate-y-1/2 rounded-full border-[26px] border-white/10" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-sm font-bold text-orange-200">ابدأ من المكان المناسب</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">اختر الفرع الأقرب إليك.</h2>
              <Link href="/branches" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-extrabold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <CalendarCheck className="size-4" />
                عرض الفروع
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
