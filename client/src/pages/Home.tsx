import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpLeft,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  CircleHelp,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FullWidthGroupHero from "@/components/FullWidthGroupHero";
import { BRANCHES } from "@/lib/clinic";
import { trpc } from "@/lib/trpc";

const PILLARS = [
  {
    icon: Stethoscope,
    title: "رعاية تخصصية متكاملة",
    text: "خدمات الأسنان والجلدية والليزر ضمن تجربة علاجية مترابطة.",
  },
  {
    icon: Building2,
    title: "فروع قريبة منك",
    text: "ثلاثة مواقع في الرياض، لتختار الفرع الأنسب لموعدك.",
  },
  {
    icon: ShieldCheck,
    title: "تجربة منظمة وواضحة",
    text: "رحلة حجز رقمية بسيطة تبدأ من اختيار الخدمة وتنتهي بتأكيد الموعد.",
  },
];

const PILLAR_STYLES = [
  { glow: "from-sky-100/90 via-white to-white", icon: "bg-primary text-white", line: "bg-primary" },
  { glow: "from-orange-100/85 via-white to-white", icon: "bg-accent text-accent-foreground", line: "bg-accent" },
  { glow: "from-cyan-100/90 via-white to-white", icon: "bg-cyan-600 text-white", line: "bg-cyan-600" },
];

const TRUST_SIGNALS = [
  {
    icon: CheckCircle2,
    title: "وضوح في رحلة الرعاية",
    text: "تظهر الخدمة والطبيب والموعد بوضوح قبل إرسال طلب الحجز.",
  },
  {
    icon: ShieldCheck,
    title: "خصوصية بيانات المراجعين",
    text: "تُستخدم بيانات الحجز بالقدر اللازم لتنسيق الموعد والتواصل بشأنه.",
  },
  {
    icon: MapPin,
    title: "سهولة الوصول",
    text: "ثلاثة فروع داخل الرياض تمنحك خيارات أقرب إلى موقعك.",
  },
];

const FAQS = [
  {
    question: "كيف أحجز موعداً؟",
    answer: "ابدأ باختيار الفرع، ثم الخدمة والطبيب والموعد المتاح، وأدخل بيانات التواصل لإرسال طلب الحجز.",
  },
  {
    question: "كيف أختار الفرع الأنسب؟",
    answer: "يمكنك مراجعة مواقع الفروع الثلاثة من دليل الفروع، أو البدء بالفرع الأقرب ثم إكمال الحجز من صفحته مباشرة.",
  },
  {
    question: "هل يمكنني اختيار الطبيب؟",
    answer: "نعم، تظهر لك خيارات الأطباء المتاحة بعد اختيار الفرع والخدمة، ثم تختار الوقت المناسب من المواعيد المعروضة.",
  },
  {
    question: "ماذا أحصل عليه بعد إرسال الطلب؟",
    answer: "تظهر لك صفحة تأكيد تتضمن رقماً مرجعياً للحجز. تبقى حالة الموعد معلقة إلى حين مراجعته من إدارة المواعيد.",
  },
];

export default function Home() {
  return (
    <PageShell>
      <FullWidthGroupHero />

      <section className="relative z-20 -mt-7 border-b border-border/70 bg-white/80 pb-5 pt-0 backdrop-blur-sm sm:-mt-10 sm:pb-7">
        <div className="container grid gap-3 md:grid-cols-3">
          {PILLARS.map((pillar, index) => {
            const style = PILLAR_STYLES[index];
            return (
              <article
                key={pillar.title}
                className={`pillar-spotlight group relative overflow-hidden rounded-[1.4rem] border border-white/90 bg-gradient-to-br ${style.glow} px-5 py-4 shadow-lg shadow-primary/10 transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:md:hover:-translate-y-2 motion-safe:md:hover:shadow-xl motion-safe:md:hover:shadow-primary/15`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span aria-hidden="true" className={`absolute inset-y-0 right-0 w-1 ${style.line}`} />
                <span aria-hidden="true" className="absolute -left-8 -top-8 size-24 rounded-full border border-primary/10 bg-white/50" />
                <div className="relative flex items-center gap-4">
                  <span className={`pillar-icon grid size-12 shrink-0 place-items-center rounded-2xl shadow-lg shadow-primary/15 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${style.icon}`}>
                    <pillar.icon className="size-5" strokeWidth={2.3} />
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold tracking-[0.2em] text-primary/60">0{index + 1} / 03</span>
                    <h2 className="mt-0.5 text-[15px] font-extrabold text-foreground">{pillar.title}</h2>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{pillar.text}</p>
                  </div>
                </div>
                <span aria-hidden="true" className="absolute bottom-0 left-5 h-px w-0 bg-primary/35 transition-[width] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:md:group-hover:w-16" />
              </article>
            );
          })}
        </div>
      </section>

      <section id="about" className="relative overflow-hidden py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_5%_50%,rgba(249,115,22,0.1),transparent_24%),radial-gradient(circle_at_95%_20%,rgba(2,132,199,0.1),transparent_26%)]" />
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="care-card group relative overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-xl shadow-primary/15 sm:p-12 lg:p-14">
            <div aria-hidden="true" className="care-card-glow pointer-events-none absolute inset-0" />
            <div aria-hidden="true" className="care-card-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/3" />
            <div className="absolute -right-20 -top-16 size-52 rounded-full border-[30px] border-white/10" />
            <div className="absolute -bottom-24 -left-12 size-52 rounded-full bg-accent/90 blur-2xl" />
            <div className="relative">
              <span className="text-xs font-bold tracking-[0.18em] text-orange-200">EVAN GROUP</span>
              <p className="mt-12 max-w-sm text-3xl font-extrabold leading-tight sm:text-4xl">الرعاية ليست خدمة منفصلة، بل منظومة متكاملة.</p>
              <div className="mt-12 grid grid-cols-3 gap-2 border-t border-white/15 pt-5">
                {[
                  ["01", "المجموعة"],
                  ["02", "الفروع"],
                  ["03", "الرعاية"],
                ].map(([number, label], index) => (
                  <div key={number} className="care-step-in" style={{ animationDelay: `${620 + index * 170}ms` }}>
                    <strong className="block text-xl font-extrabold tracking-[0.08em]">{number}</strong>
                    <span className="text-xs text-white/70">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section id="vision" className="home-vision border-y border-primary/10 bg-primary py-14 text-white lg:py-18">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="vision-copy-item inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-orange-200" style={{ animationDelay: "70ms" }}>
              <Sparkles className="size-3.5" />
              رؤيتنا
            </span>
            <h2 className="vision-copy-item mt-5 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl" style={{ animationDelay: "150ms" }}>أن تكون الرعاية الطبية الأكثر وضوحاً وقرباً من احتياج المراجع.</h2>
            <p className="vision-copy-item mt-4 max-w-2xl text-[15px] leading-8 text-white/75" style={{ animationDelay: "230ms" }}>نترجم هذه الرؤية إلى خطوات عملية: تخصصات محددة، فروع سهلة الوصول، ومواعيد يمكن إدارتها بسلاسة.</p>
            <Link href="/vision" className="vision-copy-item mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-orange-200 transition-colors hover:text-orange-100" style={{ animationDelay: "310ms" }}>
              تعرّف على رؤيتنا <ArrowUpLeft className="size-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["وضوح", "تعرف مسار الحجز قبل أن تبدأ."],
              ["قرب", "تصل إلى الفرع الأنسب لك بسهولة."],
              ["اهتمام", "تنتقل من الخدمة إلى الطبيب والموعد ضمن تجربة واحدة."],
            ].map(([title, text], index) => (
              <div key={title} className="vision-value flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4" style={{ animationDelay: `${330 + index * 110}ms` }}>
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-sm font-extrabold text-accent-foreground">✦</span>
                <div><h3 className="text-sm font-extrabold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/70">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section py-12 lg:py-16">
        <div className="container rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="border-b border-border pb-6 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-7">
              <span className="trust-copy-item text-xs font-bold tracking-[0.17em] text-accent" style={{ animationDelay: "70ms" }}>عناصر الثقة</span>
              <h2 className="trust-copy-item mt-3 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl" style={{ animationDelay: "150ms" }}>تجربة طبية تبدأ بالوضوح.</h2>
              <p className="trust-copy-item mt-3 text-sm leading-7 text-muted-foreground" style={{ animationDelay: "230ms" }}>نصمم تجربة المراجع حول معلومات واضحة، خصوصية محترمة، وفروع قريبة.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {TRUST_SIGNALS.map((signal, index) => (
                <article key={signal.title} className="trust-card rounded-2xl bg-secondary/60 p-4" style={{ animationDelay: `${290 + index * 110}ms` }}>
                  <span className="grid size-10 place-items-center rounded-xl bg-white text-primary shadow-sm">
                    <signal.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-extrabold text-foreground">{signal.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{signal.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The three branch portals are the central holding-company interaction. */}
      <section id="branches" className="py-16 lg:py-24">
        <div className="container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-[0.17em] text-accent">بوابات الفروع</span>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
                اختر الفرع الأقرب،
                <span className="text-primary"> وابدأ رحلتك من المكان المناسب.</span>
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted-foreground">
                لكل فرع صفحة مستقلة تشمل صورة المبنى، الموقع عبر خرائط Google، ونقطة حجز موجهة للفرع المختار.
              </p>
            </div>
            <Link href="/branches" className="inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline">
              عرض دليل الفروع
              <ArrowLeft className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {BRANCHES.map((branch, index) => {
              const tones = ["from-sky-50 to-white", "from-emerald-50 to-white", "from-orange-50 to-white"];
              const marks = ["bg-primary", "bg-emerald-500", "bg-accent"];
              return (
                <article key={branch.name} className={`group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${tones[index]} p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}>
                  <span className={`absolute left-0 top-0 h-full w-1 ${marks[index]}`} />
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-2xl bg-white text-primary shadow-sm">
                      <MapPin className="size-5" />
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-extrabold text-foreground">{branch.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{branch.city}</p>
                  <div className="mt-7 flex items-center justify-between border-t border-border/70 pt-5">
                    <span className="text-xs font-semibold text-muted-foreground">تخصصات وأطباء وحجز</span>
                    <Link href={branch.route} className="inline-flex items-center gap-1 text-sm font-extrabold text-primary transition-transform duration-200 group-hover:-translate-x-1">
                      استكشف الفرع <ChevronLeft className="size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-primary/10 bg-secondary/35 py-16 lg:py-20">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded-[2rem] bg-primary p-7 text-white shadow-xl shadow-primary/15 sm:p-9">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-orange-200"><CircleHelp className="size-6" /></span>
            <span className="mt-7 block text-xs font-extrabold tracking-[0.17em] text-orange-200">أسئلة شائعة</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight">كل ما تحتاج معرفته قبل الحجز.</h2>
            <p className="mt-4 text-[15px] leading-8 text-white/75">إجابات عملية وسريعة تساعدك على اختيار الفرع والخدمة والموعد بوضوح.</p>
            <Link href="/booking" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-extrabold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">ابدأ الحجز <ArrowLeft className="size-4" /></Link>
          </div>
          <div className="rounded-[2rem] border border-border bg-white px-6 shadow-sm sm:px-8">
            <Accordion type="single" collapsible defaultValue="faq-1">
              {FAQS.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index + 1}`} className="border-border">
                  <AccordionTrigger className="py-6 text-right text-[15px] font-extrabold text-foreground hover:no-underline sm:text-base">{item.question}</AccordionTrigger>
                  <AccordionContent className="max-w-2xl text-right text-sm leading-7 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-primary to-[#0a497e] px-7 py-12 text-center text-white shadow-lg shadow-primary/15 sm:px-12">
            <div className="pointer-events-none absolute -left-14 top-1/2 size-48 -translate-y-1/2 rounded-full border-[26px] border-white/10" />
            <div className="pointer-events-none absolute -right-16 -top-14 size-48 rounded-full bg-accent/80 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-sm font-bold text-orange-200">الخطوة التالية</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">ابدأ من الفرع الذي يناسبك.</h2>
              <p className="mt-4 text-[15px] leading-8 text-white/80">اختر الخدمة، ثم الطبيب، ثم الموعد المناسب، وستصل إلى تأكيد حجز واضح برقم مرجعي.</p>
              <Link href="/booking" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-extrabold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <CalendarCheck className="size-4" />
                احجز موعداً الآن
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
