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
            <p className="mt-6 max-w-2xl text-[16px] leading-9 text-white/80">نجمع في هذه الصفحة الشعارات التي ظهرت بوضوح في المادة المنشورة عبر موقع إيفان السابق، ضمن عرض موحد وسهل الوصول.</p>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/[0.1] p-7 backdrop-blur-sm sm:p-9">
            <Building2 className="size-9 text-orange-200" />
            <p className="mt-6 text-2xl font-extrabold leading-10">{PARTNERS.length} شعاراً معتمداً ضمن سجل شركاء النجاح.</p>
            <div className="mt-7 border-t border-white/15 pt-5 text-sm leading-7 text-white/70">نحافظ على وضوح مصدر كل شعار، ولا نضيف أي جهة لم يظهر اسمها بوضوح في المادة المرجعية.</div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-accent"><ShieldCheck className="size-4" /> شعارات موثقة</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">شركاء يلتقون حول جودة التجربة.</h2>
            <p className="mt-4 text-[15px] leading-8 text-muted-foreground">استعرض الجهات الظاهرة في الصورة المنشورة سابقاً ضمن صفحة مستقلة، مع الحفاظ على اسم كل شعار كما ظهر بوضوح.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {PARTNERS.map((partner, index) => (
              <article key={partner.id} className="group relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-white px-5 py-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10">
                <span className="absolute left-5 top-5 text-xs font-extrabold text-accent">{String(index + 1).padStart(2, "0")}</span>
                <img src={partner.logo} alt={`شعار ${partner.name}`} className="h-20 w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]" loading={index < 8 ? "eager" : "lazy"} />
                <h3 className="mt-6 text-xs font-extrabold text-muted-foreground" dir="ltr">{partner.name}</h3>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-6 text-muted-foreground">تُعرض هذه الشعارات كما وردت في الصورة المنشورة ضمن موقع إيفان السابق. تم استبعاد أي رمز أو شعار لم يمكن التحقق من اسمه بوضوح.</p>
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
