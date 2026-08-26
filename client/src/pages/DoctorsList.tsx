import { Link } from "wouter";
import { ArrowLeft, Award, BriefcaseBusiness, CalendarCheck, FileCheck2, Stethoscope, UserRound } from "lucide-react";
import PageShell from "@/components/PageShell";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PROFILE_SECTIONS = [
  { icon: Stethoscope, title: "التخصص الدقيق", text: "يُحدّث بعد اعتماد مجال الممارسة من السيرة المهنية." },
  { icon: BriefcaseBusiness, title: "الخبرات السابقة", text: "تُعرض جهات العمل السابقة والمدة بعد التحقق من البيانات." },
  { icon: Award, title: "الشهادات والاعتمادات", text: "تُدرج الشهادات والجهات المانحة وسنواتها بعد الاعتماد." },
];

export default function DoctorsList() {
  const { data: dentists, isLoading } = trpc.dentists.list.useQuery();

  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-primary/10 bg-secondary/35 py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-20 top-0 size-64 rounded-full border-[34px] border-primary/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-8 size-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="container relative grid gap-8 lg:grid-cols-[1fr_0.76fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary">
              <UserRound className="size-3.5" />
              ملفات الفريق الطبي
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">تعرف على فريق إيفان الطبي.</h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-muted-foreground">
              نصمم لكل طبيب ملفاً مهنياً منظماً يوضح تخصصه وخبراته وشهاداته. التفاصيل الظاهرة حالياً قالب تجريبي ريثما تُعتمد السير الذاتية الرسمية.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-primary/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <FileCheck2 className="size-6 text-accent" />
            <p className="mt-4 text-lg font-extrabold text-foreground">بيانات مهنية موثقة قبل النشر</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">لن نعرض جهات عمل أو شهادات أو أرقام تواصل شخصية قبل توفير بيانات معتمدة من إدارة المجموعة.</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-extrabold tracking-[0.16em] text-accent">قوالب الملفات المهنية</span>
              <h2 className="mt-2 text-3xl font-extrabold text-foreground">هيكل واضح لكل ملف طبي.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">اختر أي نموذج لمعاينة أقسام الخبرة والشهادات التي ستُستكمل لاحقاً.</p>
          </div>

          {isLoading && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map(i => <div key={i} className="h-[390px] animate-pulse rounded-[1.75rem] bg-secondary/60" />)}
            </div>
          )}

          {!isLoading && (dentists?.length ?? 0) === 0 && (
            <div className="rounded-[1.75rem] border border-dashed border-primary/20 bg-secondary/35 py-16 text-center text-muted-foreground">تُضاف ملفات الفريق الطبي بعد اعتماد البيانات المهنية.</div>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(dentists ?? []).map((doctor, index) => (
              <Dialog key={doctor.id}>
                <article className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                  <div className="absolute left-0 top-0 h-28 w-28 rounded-br-[4rem] bg-primary/5 transition-transform duration-500 group-hover:scale-125" />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[#0a497e] text-xl font-extrabold text-white shadow-lg shadow-primary/20">0{index + 1}</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-extrabold text-amber-700 ring-1 ring-amber-200">قيد الاعتماد</span>
                  </div>
                  <h3 className="relative mt-7 text-xl font-extrabold text-foreground">ملف الطبيب {String(index + 1).padStart(2, "0")}</h3>
                  <p className="relative mt-2 text-sm font-bold text-primary">التخصص يُحدّث بعد الاعتماد</p>
                  <p className="relative mt-5 text-sm leading-7 text-muted-foreground">نموذج جاهز لعرض النبذة المهنية، أماكن العمل السابقة، الشهادات والاعتمادات، ثم ربط الطبيب بالحجز.</p>

                  <div className="relative mt-6 space-y-3 border-y border-border py-5">
                    {PROFILE_SECTIONS.map(section => (
                      <div key={section.title} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <section.icon className="size-4 shrink-0 text-primary" />
                        <span className="font-bold text-foreground">{section.title}</span>
                      </div>
                    ))}
                  </div>

                  <div className="relative mt-6 flex gap-3">
                    <DialogTrigger asChild>
                      <button className="flex-1 rounded-xl border border-primary/15 px-4 py-3 text-sm font-extrabold text-primary transition-all hover:bg-primary hover:text-white">معاينة الملف</button>
                    </DialogTrigger>
                    <Link href="/booking" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-extrabold text-accent-foreground transition-all hover:-translate-y-0.5 hover:shadow-md">
                      ابدأ الحجز <ArrowLeft className="size-4" />
                    </Link>
                  </div>
                </article>

                <DialogContent className="max-w-2xl rounded-[1.75rem] p-0" dir="rtl">
                  <div className="bg-gradient-to-l from-primary to-[#0a497e] px-7 pb-8 pt-9 text-white">
                    <DialogHeader className="text-right">
                      <span className="text-xs font-extrabold tracking-[0.16em] text-orange-200">نموذج ملف طبي</span>
                      <DialogTitle className="mt-2 text-3xl font-extrabold">ملف الطبيب {String(index + 1).padStart(2, "0")}</DialogTitle>
                      <DialogDescription className="mt-2 text-sm leading-7 text-white/75">سيتم استبدال هذا القالب ببيانات السيرة المهنية المعتمدة قبل النشر النهائي.</DialogDescription>
                    </DialogHeader>
                  </div>
                  <div className="grid gap-4 p-7 sm:grid-cols-3">
                    {PROFILE_SECTIONS.map(section => (
                      <div key={section.title} className="rounded-2xl bg-secondary/60 p-4">
                        <section.icon className="size-5 text-primary" />
                        <h4 className="mt-4 text-sm font-extrabold text-foreground">{section.title}</h4>
                        <p className="mt-2 text-xs leading-6 text-muted-foreground">{section.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end px-7 pb-7">
                    <Link href="/booking" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-extrabold text-accent-foreground">ابدأ الحجز <CalendarCheck className="size-4" /></Link>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
