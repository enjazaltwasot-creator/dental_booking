import { Link } from "wouter";
import { ArrowLeft, CalendarCheck, Check, Stethoscope } from "lucide-react";
import PageShell from "@/components/PageShell";
import { trpc } from "@/lib/trpc";
import { SPECIALTIES } from "@/lib/clinic";

export default function ServicesList() {
  const { data: services, isLoading } = trpc.services.list.useQuery();

  return (
    <PageShell>
      <section className="border-b border-border bg-secondary/30 py-14">
        <div className="container text-center">
          <span className="inline-flex rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-extrabold text-primary">تخصصات مجموعة إيفان الطبية</span>
          <h1 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">رعاية متخصصة، ضمن منظومة واحدة</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-8 text-muted-foreground">
            نعرض التخصصات والخدمات المعلنة للمجموعة بوضوح، لتبدأ من القسم الأنسب ثم تنتقل إلى الحجز.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-3 text-right sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-accent">التخصصات المتاحة</p>
              <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">اختر مسار الرعاية المناسب لك</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">كل بطاقة توضح نطاق التخصص وتمنحك نقطة انتقال مباشرة إلى رحلة الحجز.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {SPECIALTIES.map(specialty => (
              <article key={specialty.id} className="group overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <img src={specialty.image} alt={specialty.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/65 to-transparent" />
                  <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-primary shadow-sm">{specialty.subtitle}</span>
                  <span className="absolute bottom-4 left-4 text-2xl font-black tracking-tight text-white/85">{specialty.number}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-foreground">{specialty.title}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-7 text-muted-foreground">{specialty.description}</p>
                  <ul className="mt-5 space-y-2 border-t border-border pt-4">
                    {specialty.highlights.map(highlight => (
                      <li key={highlight} className="flex items-start gap-2 text-sm font-semibold text-foreground/85">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/booking" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    ابدأ الحجز
                    <ArrowLeft className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/25 py-16">
        <div className="container">
          <div className="mb-8 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"><CalendarCheck className="size-4" /> خدمات الحجز في قسم الأسنان</span>
            <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">اختر الخدمة السنية ثم انتقل إلى الطبيب والموعد</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">الخدمات أدناه تعكس الخيارات المعلنة في قسم الأسنان؛ سيظهر لك الوقت المتاح ضمن نموذج الحجز.</p>
          </div>
          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-52 animate-pulse rounded-2xl border border-border bg-secondary/50" />
              ))}
            </div>
          )}

          {!isLoading && (services?.length ?? 0) === 0 && (
            <p className="py-16 text-center text-muted-foreground">لا توجد خدمات متاحة حالياً.</p>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(services ?? []).map(service => (
              <article
                key={service.id}
                className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Stethoscope className="size-5" />
                </span>
                <h2 className="mt-5 text-lg font-bold text-foreground">{service.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{service.description}</p>
                <div className="mt-5 flex items-center justify-end border-t border-border pt-4">
                  <Link
                    href="/booking"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all duration-200 hover:shadow-md"
                  >
                    انتقل للحجز
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
