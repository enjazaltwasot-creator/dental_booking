import { Link } from "wouter";
import { ArrowLeft, CalendarCheck, Check, Sparkles, Stethoscope } from "lucide-react";
import PageShell from "@/components/PageShell";
import { trpc } from "@/lib/trpc";
import { SPECIALTIES } from "@/lib/clinic";
import { cn } from "@/lib/utils";

const ORBIT_POSITIONS = [
  "md:left-1/2 md:top-1 md:-translate-x-1/2",
  "md:bottom-8 md:right-0",
  "md:bottom-8 md:left-0",
];
const ORBIT_TONES = [
  "border-primary/25 bg-primary/5 text-primary",
  "border-accent/30 bg-accent/10 text-accent",
  "border-sky-200 bg-sky-50 text-sky-700",
];

export default function ServicesList() {
  const { data: services, isLoading } = trpc.services.list.useQuery();

  return (
    <PageShell>
      <section className="border-b border-border bg-secondary/30 py-14">
        <div className="container text-center">
          <span className="rise-in inline-flex rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-extrabold text-primary">تخصصات مجموعة إيفان الطبية</span>
          <h1 className="rise-in mt-4 text-3xl font-extrabold text-foreground sm:text-4xl" style={{ animationDelay: "80ms" }}>رعاية متخصصة، ضمن منظومة واحدة</h1>
          <p className="rise-in mx-auto mt-3 max-w-2xl text-[15px] leading-8 text-muted-foreground" style={{ animationDelay: "150ms" }}>لكل تخصص مساره وبنوده الواضحة. استكشف التفاصيل حول التخصص الرئيسي، ثم انتقل إلى الحجز من المكان نفسه.</p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mb-10 flex flex-col gap-3 text-right sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-extrabold text-accent">التخصصات المتاحة</p><h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">تعرّف على كل تخصص من مركزه</h2></div>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">تتحرك بنود الرعاية حول كل تخصص بصرياً لتسهيل قراءة نطاق الخدمة قبل بدء رحلة الحجز.</p>
          </div>

          <div className="space-y-8 lg:space-y-10">
            {SPECIALTIES.map((specialty, specialtyIndex) => (
              <article key={specialty.id} style={{ animationDelay: `${120 + specialtyIndex * 90}ms` }} className="rise-in relative overflow-hidden rounded-[2rem] border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md sm:p-8">
                <div className="pointer-events-none absolute -left-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                  <div className="order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary"><Sparkles className="size-3.5" />{specialty.number} · {specialty.subtitle}</div>
                    <h3 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">{specialty.title}</h3>
                    <p className="mt-4 max-w-xl text-[15px] leading-8 text-muted-foreground">{specialty.description}</p>
                    <div className="mt-7 flex flex-wrap gap-2">{specialty.highlights.map((highlight, index) => <span key={highlight} className={cn("rounded-full border px-3 py-1.5 text-xs font-extrabold", ORBIT_TONES[index])}>{highlight}</span>)}</div>
                    <Link href="/booking" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">ابدأ الحجز في هذا التخصص<ArrowLeft className="size-4" /></Link>
                  </div>

                  <div className="order-1 flex flex-col gap-3 md:relative md:order-2 md:min-h-[390px] md:items-center md:justify-center">
                    <div className="pointer-events-none absolute hidden size-[330px] rounded-full border border-dashed border-primary/30 md:block" />
                    <div className="pointer-events-none absolute hidden size-[250px] rounded-full border border-primary/10 md:block" />
                    <div className="relative z-10 mx-auto overflow-hidden rounded-full border-8 border-white bg-secondary shadow-xl shadow-primary/10 ring-1 ring-primary/10 md:absolute md:left-1/2 md:top-1/2 md:size-52 md:-translate-x-1/2 md:-translate-y-1/2">
                      <img src={specialty.image} alt={specialty.imageAlt} className="size-40 object-cover sm:size-48 md:size-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                      <span className="absolute inset-x-3 bottom-4 text-center text-sm font-extrabold text-white">{specialty.title}</span>
                    </div>
                    {specialty.highlights.map((highlight, index) => <div key={highlight} className={cn("relative z-20 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold shadow-sm transition-transform duration-300 hover:-translate-y-1 md:absolute md:w-44", ORBIT_TONES[index], ORBIT_POSITIONS[index])}><span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/80"><Check className="size-3.5" /></span><span>{highlight}</span></div>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/25 py-16">
        <div className="container">
          <div className="mb-8 max-w-2xl"><span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"><CalendarCheck className="size-4" />خدمات الحجز في قسم الأسنان</span><h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">اختر الخدمة السنية ثم انتقل إلى الطبيب والموعد</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">الخدمات أدناه تعكس الخيارات المعلنة في قسم الأسنان؛ سيظهر لك الوقت المتاح ضمن نموذج الحجز.</p></div>
          {isLoading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4, 5].map(item => <div key={item} className="h-52 animate-pulse rounded-2xl border border-border bg-secondary/50" />)}</div>}
          {!isLoading && (services?.length ?? 0) === 0 && <p className="py-16 text-center text-muted-foreground">لا توجد خدمات متاحة حالياً.</p>}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{(services ?? []).map((service, index) => <article key={service.id} style={{ animationDelay: `${100 + index * 60}ms` }} className="rise-in group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"><span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"><Stethoscope className="size-5" /></span><h2 className="mt-5 text-lg font-bold text-foreground">{service.name}</h2><p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{service.description}</p><div className="mt-5 flex items-center justify-end border-t border-border pt-4"><Link href="/booking" className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all duration-200 hover:shadow-md">انتقل للحجز</Link></div></article>)}</div>
        </div>
      </section>
    </PageShell>
  );
}
