import { Link } from "wouter";
import {
  ArrowLeft,
  CalendarCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { BRANCHES, CLINIC } from "@/lib/clinic";
import { trpc } from "@/lib/trpc";

const HIGHLIGHTS = [
  { icon: Timer, title: "حجز في دقائق", text: "اختر الخدمة والطبيب والموعد المناسب لك بخطوات بسيطة." },
  { icon: ShieldCheck, title: "أطباء معتمدون", text: "نخبة من الأطباء ذوي الخبرة في مختلف التخصصات." },
  { icon: MapPin, title: "ثلاثة فروع", text: "مواقع استراتيجية في الرياض تسهّل الوصول إليك." },
];

export default function Home() {
  const { data: services } = trpc.services.list.useQuery();
  const { data: dentists } = trpc.dentists.list.useQuery();

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 90% at 85% 0%, oklch(0.95 0.04 235) 0%, transparent 55%), radial-gradient(90% 80% at 5% 20%, oklch(0.97 0.03 200) 0%, transparent 60%)",
          }}
        />
        <div className="container grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="rise-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <Sparkles className="size-3.5" />
              مركز طبي متخصص
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.25] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              {CLINIC.name}
            </h1>
            <p className="mt-3 text-lg font-bold text-primary sm:text-xl">
              {CLINIC.tagline}
            </p>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-muted-foreground">
              {CLINIC.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <CalendarCheck className="size-4" />
                احجز موعدك الآن
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-7 py-3.5 text-sm font-bold text-foreground transition-all duration-200 hover:border-primary/40 hover:shadow-md"
              >
                تعرّف على أطبائنا
                <ArrowLeft className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 rise-in sm:grid-cols-2 lg:grid-cols-1">
            {HIGHLIGHTS.map(item => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">خدماتنا</span>
              <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
                رعاية شاملة لصحتك وجمالك
              </h2>
            </div>
            <Link href="/services" className="text-sm font-bold text-primary hover:underline">
              عرض جميع الخدمات
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(services ?? []).slice(0, 6).map(service => (
              <article
                key={service.id}
                className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Stethoscope className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{service.name}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{service.description}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                  <Timer className="size-3.5" />
                  {service.duration} دقيقة
                </p>
              </article>
            ))}

            {!services && (
              <>
                {[0, 1, 2].map(i => (
                  <div key={i} className="h-52 animate-pulse rounded-2xl border border-border bg-secondary/50" />
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="border-y border-border bg-secondary/30 py-16 lg:py-20">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">فريقنا</span>
              <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
                أطباء متخصصون بخبرة عالية
              </h2>
            </div>
            <Link href="/doctors" className="text-sm font-bold text-primary hover:underline">
              عرض جميع الأطباء
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(dentists ?? []).map(doctor => (
              <article
                key={doctor.id}
                className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-xl font-extrabold text-primary">
                  {doctor.name.replace("د.", "").trim().charAt(0)}
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{doctor.name}</h3>
                <p className="mt-1 text-sm font-semibold text-primary">{doctor.specialization}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">فروعنا</span>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
              نخدمك من ثلاثة مواقع
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {BRANCHES.map(branch => (
              <article
                key={branch.name}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <MapPin className="size-5 text-primary" />
                  {branch.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{branch.city}</p>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-foreground" dir="ltr">
                  <Phone className="size-4 text-primary" />
                  {branch.phone}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container">
          <div className="overflow-hidden rounded-3xl border border-border bg-primary px-8 py-14 text-center shadow-sm">
            <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
              اختيارك الصحيح تجده معنا
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-8 text-primary-foreground/85">
              سجّل موعدك الآن واحصل على استشارة مع نخبة من الأطباء المتخصصين.
            </p>
            <Link
              href="/booking"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-accent-foreground shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <CalendarCheck className="size-4" />
              سجّل موعدك الآن
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
