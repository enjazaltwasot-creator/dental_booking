import { Link } from "wouter";
import { ArrowLeft, Building2, CalendarCheck, Handshake, ShieldCheck } from "lucide-react";
import PageShell from "@/components/PageShell";
import { PARTNERS } from "@/lib/clinic";

export default function Partners() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-primary py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -right-28 -top-28 size-[28rem] rounded-full border-[74px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-36 -left-20 size-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="container relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold tracking-[0.14em] text-orange-200"><Handshake className="size-3.5" /> شركاء النجاح</span>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.18] sm:text-6xl">علاقات تعزز تجربة الرعاية.</h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-9 text-white/80">عرض منظم للشعارات الأصلية التي تم اعتمادها للمجموعة، ضمن شبكة متوازنة تحافظ على وضوح كل علامة.</p>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/[0.1] p-7 backdrop-blur-sm sm:p-9">
            <Building2 className="size-9 text-orange-200" />
            <p className="mt-6 text-2xl font-extrabold leading-10">{PARTNERS.length} علامة ضمن شركاء النجاح.</p>
            <div className="mt-7 border-t border-white/15 pt-5 text-sm leading-7 text-white/70">تمت مواءمة الأصول لعرض موحد، من دون تغيير هوية أو ألوان أي علامة.</div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-accent"><ShieldCheck className="size-4" /> شعارات موثقة</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">شركاء يلتقون حول جودة التجربة.</h2>
            <p className="mt-4 text-[15px] leading-8 text-muted-foreground">استعرض العلامات ضمن معرض منسق يضع وضوح كل شعار وتوازنه البصري في المقام الأول.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {PARTNERS.map((partner, index) => (
              <article key={partner.id} className="group relative flex min-h-48 flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-white px-4 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10 sm:min-h-52 sm:px-5">
                <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-l from-transparent via-primary/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <img src={partner.logo} alt={`شعار ${partner.name}`} className="h-24 w-full object-contain transition-transform duration-300 group-hover:scale-[1.055] sm:h-28" loading={index < 8 ? "eager" : "lazy"} />
                <h3 className="mt-5 text-[11px] font-extrabold tracking-[0.08em] text-muted-foreground" dir="ltr">{partner.name}</h3>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-6 text-muted-foreground">تُعرض الشعارات بالأصول المتاحة للمجموعة وبنسب عرض موحّدة لتسهيل قراءتها على مختلف الشاشات.</p>
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-primary to-[#0a497e] px-7 py-12 text-center text-white shadow-xl shadow-primary/15 sm:px-12">
            <div className="pointer-events-none absolute -right-14 -top-14 size-52 rounded-full border-[30px] border-white/10" />
            <div className="pointer-events-none absolute -left-14 bottom-0 size-56 rounded-full bg-accent/50 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-sm font-extrabold text-orange-200">رحلة رعاية منظمة</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">ابدأ من الفرع الذي يناسبك.</h2>
              <p className="mt-4 text-[15px] leading-8 text-white/80">اختر الخدمة والطبيب والموعد المناسب ضمن تجربة حجز واضحة.</p>
              <Link href="/booking" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-extrabold text-accent-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg"><CalendarCheck className="size-4" /> احجز موعداً الآن</Link>
              <Link href="/" className="mr-3 mt-8 inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-extrabold text-white transition-all hover:bg-white/10">العودة للرئيسية <ArrowLeft className="size-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
