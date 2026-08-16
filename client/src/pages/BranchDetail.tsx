import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, ArrowUpLeft, CalendarCheck, Clock3, MapPin, Navigation, Phone, Sparkles, Stethoscope } from "lucide-react";
import PageShell from "@/components/PageShell";
import NotFound from "@/pages/NotFound";
import { DEPARTMENTS, getBranchByRouteSegment } from "@/lib/clinic";

const HIGHLIGHTS = [
  "اختيار الفرع قبل بدء الحجز",
  "رابط مباشر لاتجاهات Google Maps",
  "تخصصات الأسنان والجلدية والليزر",
];

export default function BranchDetail() {
  const [, params] = useRoute("/branches/:slug");
  const branch = getBranchByRouteSegment(params?.slug);

  if (!branch) return <NotFound />;

  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-primary/10 bg-secondary/45 py-12 lg:py-16">
        <div className="container grid gap-8 lg:grid-cols-[1fr_0.88fr] lg:items-center">
          <div>
            <Link href="/branches" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent">
              <ArrowRight className="size-4" />
              كل الفروع
            </Link>
            <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-sm">
              <MapPin className="size-3.5" />
              {branch.city}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">{branch.name}</h1>
            <p className="mt-4 max-w-xl text-[15px] leading-8 text-muted-foreground">
              بوابة الفرع لتحديد الموقع وبدء الحجز بصورة مباشرة من الفرع الذي يناسبك.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={branch.bookingPath} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-extrabold text-accent-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <CalendarCheck className="size-4" />
                احجز الآن في هذا الفرع
              </Link>
              <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-5 py-3.5 text-sm font-extrabold text-primary transition-all duration-200 hover:shadow-sm">
                <Navigation className="size-4" />
                الاتجاهات في Google Maps
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-xl shadow-primary/10">
            <img src={branch.image} alt={branch.imageAlt} className="aspect-[4/3] w-full rounded-[1.55rem] object-cover object-center" />
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container grid gap-8 lg:grid-cols-[0.83fr_1.17fr]">
          <aside className="rounded-3xl bg-primary p-7 text-white sm:p-8">
            <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-orange-200"><MapPin className="size-5" /></span>
            <h2 className="mt-6 text-2xl font-extrabold">موقع الفرع</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">{branch.address}</p>
            <div className="mt-7 space-y-4 border-t border-white/15 pt-5 text-sm">
              <span className="flex items-center gap-2 text-white/85"><Clock3 className="size-4 text-orange-200" />أوقات الزيارة تعتمد على تأكيد الفرع.</span>
              <span className="flex items-center gap-2 text-white/85" dir="ltr"><Phone className="size-4 text-orange-200" />{branch.phone}</span>
            </div>
            <p className="mt-5 text-xs leading-5 text-white/55">رقم التواصل الحالي تجريبي إلى حين اعتماد أرقام الفروع الرسمية.</p>
          </aside>
          <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="group relative flex min-h-[330px] overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-sky-50 via-white to-orange-50 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-9">
            <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(30,58,138,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.07)_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 size-60 rounded-full border-[30px] border-primary/10" />
            <div className="relative my-auto">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20"><Navigation className="size-6" /></span>
              <p className="mt-7 text-xs font-bold tracking-[0.17em] text-accent">GOOGLE MAPS</p>
              <h2 className="mt-3 text-2xl font-extrabold text-foreground">افتح موقع {branch.shortName} واتجه إليه بسهولة.</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{branch.address}</p>
              <span className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground transition-transform duration-200 group-hover:-translate-x-1">
                فتح الاتجاهات <ArrowUpLeft className="size-4" />
              </span>
            </div>
          </a>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-secondary/40 py-14 lg:py-20">
        <div className="container grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <span className="text-xs font-bold tracking-[0.17em] text-accent">رحلة الحجز</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground">ابدأ من فرعك، ثم أكمل الموعد بثقة.</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-muted-foreground">
              عند بدء الحجز من هذه الصفحة، يتم اختيار الفرع تلقائياً في نموذج الحجز، لتكون رحلتك أقرب إلى احتياجك من أول خطوة.
            </p>
            <div className="mt-7 grid gap-3">
              {HIGHLIGHTS.map((highlight, index) => (
                <div key={highlight} className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-xs font-extrabold text-accent-foreground">0{index + 1}</span>
                  <span className="text-sm font-bold text-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-7">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles className="size-5" /></span>
            <h3 className="mt-5 text-xl font-extrabold text-foreground">التخصصات المتاحة ضمن المجموعة</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">تظهر قائمة الخدمات والأطباء المتاحة حالياً في النظام أثناء الحجز، ويُحفظ اختيار الفرع مع طلبك.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {DEPARTMENTS.map(department => <span key={department} className="rounded-full bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground">{department}</span>)}
            </div>
            <Link href={branch.bookingPath} className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline">
              متابعة الحجز في {branch.shortName} <ArrowLeft className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {branch.galleryImage && (
        <section className="py-14 lg:py-20">
          <div className="container grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.17em] text-accent"><Stethoscope className="size-4" />معرض الفرع</span>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground">واجهة فرع {branch.shortName} نهاراً.</h2>
              <p className="mt-4 text-[15px] leading-8 text-muted-foreground">نظرة إضافية على واجهة الفرع لمساعدتك على التعرف إلى الموقع قبل الزيارة.</p>
              <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline">
                افتح موقع الفرع <ArrowUpLeft className="size-4" />
              </a>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border bg-white p-2 shadow-sm">
              <img src={branch.galleryImage} alt={`واجهة مبنى ${branch.name} نهاراً`} className="aspect-[4/3] w-full rounded-[1.25rem] object-cover object-center" />
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
