import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpLeft,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  HeartPulse,
  MapPin,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  UsersRound,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { BRANCHES, CLINIC, DEPARTMENTS } from "@/lib/clinic";
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

const DEPARTMENT_META = [
  { icon: Stethoscope, tone: "bg-sky-50 text-primary", text: "حلول وقائية وعلاجية وتجميليّة لصحة الفم والأسنان." },
  { icon: ScanFace, tone: "bg-amber-50 text-amber-700", text: "رعاية متخصصة للبشرة والتجميل بإشراف طبي." },
  { icon: Sparkles, tone: "bg-emerald-50 text-emerald-700", text: "جلسات ليزر وخدمات حديثة ضمن بيئة مريحة." },
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

const GROUP_VALUES = [
  "تخصصات مترابطة ضمن تجربة رعاية واحدة",
  "حجز رقمي واضح يبدأ من احتياج المراجع",
  "فروع قريبة تمنحك مرونة أكبر في اختيار الموعد",
];

export default function Home() {
  const { data: services } = trpc.services.list.useQuery();
  const { data: dentists } = trpc.dentists.list.useQuery();

  return (
    <PageShell>
      {/* Corporate hero: intentionally content-led, rather than a generic clinic banner. */}
      <section className="relative isolate overflow-hidden border-b border-border bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,rgba(33,105,181,0.12),transparent_28%),radial-gradient(circle_at_5%_85%,rgba(249,115,22,0.11),transparent_24%)]" />
        <div className="container grid gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-20">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              منظومة رعاية صحية متخصصة في الرياض
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.22] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {CLINIC.name}
              <span className="mt-2 block text-primary">رعاية تُبنى حولك.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              نجمع بين التخصص الطبي وسهولة الوصول إلى الخدمة؛ من خلال ثلاثة فروع ورحلة حجز رقمية واضحة تضع احتياج المراجع أولاً.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <CalendarCheck className="size-4" />
                ابدأ حجز موعد
              </Link>
              <a
                href="#branches"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-bold text-foreground transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
              >
                استكشف فروع المجموعة
                <ArrowLeft className="size-4" />
              </a>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-x-reverse divide-border rounded-2xl border border-border bg-white/85 p-4 shadow-sm">
              <div className="px-3 text-center">
                <strong className="block text-2xl font-extrabold text-primary">3</strong>
                <span className="mt-1 block text-xs font-semibold text-muted-foreground">فروع في الرياض</span>
              </div>
              <div className="px-3 text-center">
                <strong className="block text-2xl font-extrabold text-primary">3</strong>
                <span className="mt-1 block text-xs font-semibold text-muted-foreground">مجالات تخصصية</span>
              </div>
              <div className="px-3 text-center">
                <strong className="block text-2xl font-extrabold text-primary">1</strong>
                <span className="mt-1 block text-xs font-semibold text-muted-foreground">رحلة حجز موحّدة</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/15 sm:p-8">
              <div className="absolute -left-20 -top-24 size-56 rounded-full border-[32px] border-white/10" />
              <div className="absolute -bottom-28 -right-20 size-64 rounded-full bg-accent/90 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-white/15 pb-5">
                  <span className="text-xs font-bold tracking-[0.2em] text-white/70">EVAN MEDICAL GROUP</span>
                  <span className="grid size-11 place-items-center rounded-2xl bg-white/12">
                    <HeartPulse className="size-5" />
                  </span>
                </div>
                <div className="relative mt-5 h-40 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/15 via-sky-300/10 to-transparent sm:h-48">
                  <img
                    src="/manus-storage/evan-3d-care-orbit_e6f66c40.png"
                    alt="مجسم ثلاثي الأبعاد يرمز إلى رحلة الرعاية المتصلة"
                    className="absolute inset-0 h-full w-full object-cover object-center drop-shadow-2xl"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-primary/55 via-transparent to-primary/10" />
                  <span className="absolute bottom-3 right-4 rounded-full border border-white/20 bg-primary/60 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-white/90 backdrop-blur-sm">CONNECTED CARE</span>
                </div>
                <div className="py-7 sm:py-8">
                  <p className="text-sm font-semibold text-white/70">رؤيتنا في الرعاية</p>
                  <h2 className="mt-3 max-w-md text-3xl font-extrabold leading-tight sm:text-4xl">
                    منظومة صحية إنسانية، قريبة، ومتصلة.
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                    صفحة واحدة تفتح لك الطريق إلى فروع المجموعة وخدماتها وفريقها الطبي.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {BRANCHES.map((branch, index) => (
                    <div key={branch.name} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                      <span className="text-xs font-bold text-accent-foreground">0{index + 1}</span>
                      <p className="mt-5 text-sm font-bold">{branch.name.replace("فرع ", "")}</p>
                      <p className="mt-1 text-[11px] text-white/65">الرياض</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/45 py-6">
        <div className="container grid gap-3 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="flex items-center gap-3 px-2 py-2">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm">
                <pillar.icon className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-foreground">{pillar.title}</h2>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{pillar.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="relative overflow-hidden py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_5%_50%,rgba(249,115,22,0.1),transparent_24%),radial-gradient(circle_at_95%_20%,rgba(2,132,199,0.1),transparent_26%)]" />
        <div className="container grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary p-7 text-white shadow-xl shadow-primary/15 sm:p-10">
            <div className="absolute -right-20 -top-16 size-52 rounded-full border-[30px] border-white/10" />
            <div className="absolute -bottom-24 -left-12 size-52 rounded-full bg-accent/90 blur-2xl" />
            <div className="relative">
              <span className="text-xs font-bold tracking-[0.18em] text-orange-200">EVAN GROUP</span>
              <p className="mt-12 max-w-sm text-3xl font-extrabold leading-tight sm:text-4xl">الرعاية ليست خدمة منفصلة، بل منظومة متكاملة.</p>
              <div className="mt-12 grid grid-cols-3 gap-2 border-t border-white/15 pt-5">
                <div><strong className="block text-xl font-extrabold">01</strong><span className="text-xs text-white/70">المجموعة</span></div>
                <div><strong className="block text-xl font-extrabold">02</strong><span className="text-xs text-white/70">الفروع</span></div>
                <div><strong className="block text-xl font-extrabold">03</strong><span className="text-xs text-white/70">الرعاية</span></div>
              </div>
            </div>
          </div>
          <div className="lg:pr-6">
            <span className="text-xs font-bold tracking-[0.17em] text-accent">من نحن</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">وجهة طبية تجمع التخصص وسهولة الوصول.</h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-muted-foreground">
              {CLINIC.name} تجمع خدمات طب الأسنان والجلدية والليزر ضمن رحلة علاجية منظمة، وتمنح المراجع بوابة واحدة للوصول إلى تخصصاته وفروعه وموعده المناسب.
            </p>
            <div className="mt-8 space-y-3">
              {GROUP_VALUES.map((value, index) => (
                <div key={value} className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-xs font-extrabold text-accent-foreground">0{index + 1}</span>
                  <span className="text-sm font-bold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="vision" className="border-y border-primary/10 bg-primary py-14 text-white lg:py-18">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-orange-200">
              <Sparkles className="size-3.5" />
              رؤيتنا
            </span>
            <h2 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">أن تكون الرعاية الطبية الأكثر وضوحاً وقرباً من احتياج المراجع.</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-white/75">نترجم هذه الرؤية إلى خطوات عملية: تخصصات محددة، فروع سهلة الوصول، ومواعيد يمكن إدارتها بسلاسة.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["وضوح", "تعرف مسار الحجز قبل أن تبدأ."],
              ["قرب", "تصل إلى الفرع الأنسب لك بسهولة."],
              ["اهتمام", "تنتقل من الخدمة إلى الطبيب والموعد ضمن تجربة واحدة."],
            ].map(([title, text]) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-sm font-extrabold text-accent-foreground">✦</span>
                <div><h3 className="text-sm font-extrabold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/70">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="border-b border-border pb-6 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-7">
              <span className="text-xs font-bold tracking-[0.17em] text-accent">عناصر الثقة</span>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">تجربة طبية تبدأ بالوضوح.</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">نصمم تجربة المراجع حول معلومات واضحة، خصوصية محترمة، وفروع قريبة.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {TRUST_SIGNALS.map((signal) => (
                <article key={signal.title} className="rounded-2xl bg-secondary/60 p-4">
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
                في النسخة الكاملة ستكون لكل بوابة صفحة مستقلة تشمل التخصصات والأطباء والخريطة والحجز الخاص بالفرع.
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
                    <Link href="/booking" className="inline-flex items-center gap-1 text-sm font-extrabold text-primary transition-transform duration-200 group-hover:-translate-x-1">
                      استكشف الفرع <ChevronLeft className="size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="specialties" className="relative overflow-hidden border-y border-primary/10 bg-primary py-16 text-white lg:py-20">
        <div className="pointer-events-none absolute -left-16 top-0 size-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-0 size-80 rounded-full border-[42px] border-white/5" />
        <div className="container grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-orange-200">
              <CheckCircle2 className="size-3.5" />
              تخصصاتنا
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
              من التخصص إلى التجربة، تحت مظلة واحدة.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-8 text-slate-300">
              تعرف على محاور الرعاية المتاحة لدى المجموعة، ثم انتقل مباشرة إلى الحجز لاختيار الخدمة والطبيب والموعد.
            </p>
            <Link href="/services" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-orange-200 hover:text-orange-100">
              عرض جميع الخدمات <ArrowUpLeft className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {DEPARTMENTS.map((department, index) => {
              const item = DEPARTMENT_META[index];
              return (
                <article key={department} className="rounded-2xl border border-white/15 bg-white/[0.1] p-5 backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.16]">
                  <span className={`grid size-11 place-items-center rounded-xl ${item.tone}`}>
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-7 text-lg font-extrabold">{department}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-3xl border border-border bg-secondary/55 p-7 sm:p-9">
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-primary shadow-sm"><UsersRound className="size-5" /></span>
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">فريق طبي قريب من احتياجك</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-8 text-muted-foreground">
              يتيح الموقع الوصول إلى الأطباء المتاحين والتخصصات، ثم يربط الحجز بالطبيب والموعد ضمن خطوات واضحة.
            </p>
            <Link href="/doctors" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-5 py-3 text-sm font-extrabold text-primary transition-all duration-200 hover:shadow-sm">
              تعرّف على الفريق الطبي <ArrowLeft className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(dentists ?? []).slice(0, 4).map((doctor) => (
              <article key={doctor.id} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-base font-extrabold text-primary">
                  {doctor.name.replace("د.", "").trim().charAt(0)}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">{doctor.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-primary">{doctor.specialization}</p>
                </div>
              </article>
            ))}
            {!dentists && [0, 1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-2xl bg-secondary" />)}
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
