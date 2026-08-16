import { Link } from "wouter";
import { ArrowLeft, CalendarCheck, Check, Compass, Eye, HeartHandshake, MapPin, Route, Sparkles, Target } from "lucide-react";
import PageShell from "@/components/PageShell";

const VALUES = [
  { icon: Eye, title: "الوضوح", text: "نجعل رحلة المراجع مفهومة منذ اختيار الخدمة وحتى تأكيد الموعد." },
  { icon: MapPin, title: "القرب", text: "نربط التخصصات والفروع لتصبح الخدمة الأقرب أسهل وصولاً." },
  { icon: HeartHandshake, title: "الاهتمام", text: "نصمم التفاصيل الرقمية حول احتياج المراجع ووقته وخياراته." },
  { icon: Route, title: "الاستمرارية", text: "نبني تجربة مترابطة بين الحجز والفريق الطبي والزيارة القادمة." },
];

const JOURNEY = [
  "تخصصات محددة تساعد المراجع على فهم خياراته.",
  "فروع واضحة تسهّل اختيار الموقع الأنسب.",
  "حجز منظم يربط الخدمة والطبيب والموعد.",
  "متابعة قابلة للتطوير مع القنوات الرقمية المعتمدة.",
];

export default function Vision() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-primary py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -right-28 -top-28 size-[28rem] rounded-full border-[74px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-36 -left-20 size-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="container relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold tracking-[0.14em] text-orange-200">
              <Sparkles className="size-3.5" /> رؤيتنا
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.18] sm:text-6xl">رعاية أوضح، أقرب إلى احتياجك.</h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-9 text-white/80">نتطلع إلى تجربة طبية موحّدة تساعد المراجع على الوصول إلى التخصص والفرع والموعد المناسب من مكان واحد.</p>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/[0.1] p-7 backdrop-blur-sm sm:p-9">
            <Target className="size-9 text-orange-200" />
            <p className="mt-6 text-2xl font-extrabold leading-10">أن تكون الرعاية الطبية الأكثر وضوحاً وقرباً من احتياج المراجع.</p>
            <div className="mt-7 border-t border-white/15 pt-5 text-sm leading-7 text-white/70">رؤية تقودها خطوات عملية في التخصصات والفروع والحجز، وتتطور مع احتياجات المراجعين.</div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="rounded-[2rem] border border-primary/10 bg-secondary/45 p-7 sm:p-9">
            <Compass className="size-9 text-primary" />
            <span className="mt-7 block text-xs font-extrabold tracking-[0.16em] text-accent">رسالتنا</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground">نبني رحلة رعاية منظمة تضع الاختيار بيد المراجع.</h2>
            <p className="mt-5 text-[15px] leading-8 text-muted-foreground">نربط بين المعلومات الواضحة، والفروع، وخيارات الحجز كي تكون كل خطوة مفهومة وسهلة الوصول.</p>
          </div>
          <div>
            <span className="text-xs font-extrabold tracking-[0.16em] text-accent">ما الذي يوجّه قراراتنا؟</span>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">قيم تتحول إلى تجربة ملموسة.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {VALUES.map((value, index) => (
                <article key={value.title} className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><value.icon className="size-5" /></span>
                    <span className="text-xs font-extrabold text-accent">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-foreground">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-white py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <span className="text-xs font-extrabold tracking-[0.16em] text-accent">من الرؤية إلى الممارسة</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">منظومة أقرب إلى احتياجك.</h2>
            <p className="mt-4 max-w-lg text-[15px] leading-8 text-muted-foreground">لا نختصر الرؤية في عبارة؛ بل نترجمها إلى عناصر واضحة تساعد المراجع في كل مرحلة من رحلته.</p>
          </div>
          <div className="space-y-3">
            {JOURNEY.map((item, index) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-border bg-secondary/35 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-white hover:shadow-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-sm font-extrabold text-accent-foreground">0{index + 1}</span>
                <p className="text-sm font-bold leading-7 text-foreground">{item}</p>
                <Check className="mr-auto size-4 text-primary" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-primary to-[#0a497e] px-7 py-12 text-center text-white shadow-xl shadow-primary/15 sm:px-12">
            <div className="pointer-events-none absolute -right-14 -top-14 size-52 rounded-full border-[30px] border-white/10" />
            <div className="pointer-events-none absolute -left-14 bottom-0 size-56 rounded-full bg-accent/50 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-sm font-extrabold text-orange-200">ابدأ رحلتك معنا</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">اختر التخصص والفرع والموعد المناسب.</h2>
              <p className="mt-4 text-[15px] leading-8 text-white/80">تبدأ تجربة الرعاية بخطوة بسيطة ومنظمة.</p>
              <Link href="/booking" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-extrabold text-accent-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <CalendarCheck className="size-4" /> احجز موعداً الآن
              </Link>
              <Link href="/specialties" className="mr-3 mt-8 inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-extrabold text-white transition-all hover:bg-white/10">
                استكشف التخصصات <ArrowLeft className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
