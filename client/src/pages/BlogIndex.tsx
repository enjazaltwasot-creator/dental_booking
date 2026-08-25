import { ArrowLeft, BookOpenCheck, Clock3, FileWarning, Stethoscope } from "lucide-react";
import { Link } from "wouter";
import PageShell from "@/components/PageShell";
import { BLOG_POSTS } from "@shared/blog";

export default function BlogIndex() {
  return <PageShell>
    <section className="border-b border-primary/10 bg-secondary/35 py-16 sm:py-20">
      <div className="container max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary"><BookOpenCheck className="size-3.5" />مركز التوعية الصحية</span>
        <h1 className="mt-5 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">محتوى توعوي يبدأ بالمعلومة المسؤولة.</h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-8 text-muted-foreground">مسودات معرفية عامة حول طب الأسنان والجلدية والليزر. لا تمثل تشخيصاً أو خطة علاجية أو بديلاً عن استشارة المختص.</p>
      </div>
    </section>
    <section className="py-14 sm:py-18"><div className="container">
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900"><FileWarning className="mt-0.5 size-5 shrink-0" /><p><strong>قيد المراجعة الطبية:</strong> هذه المقالات متاحة للمراجعة الداخلية ولا تُدرج في خريطة الموقع أو نتائج البحث إلى أن تعتمدها الإدارة الطبية بالمجموعة.</p></div>
      <div className="grid gap-5 lg:grid-cols-3">{BLOG_POSTS.map((post, index) => <article key={post.slug} className="group flex min-h-[310px] flex-col rounded-[1.75rem] border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
        <div className="flex items-center justify-between"><span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary">{post.category}</span><span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary"><Stethoscope className="size-4" /></span></div>
        <p className="mt-6 text-xs font-bold text-accent">مسودة {String(index + 1).padStart(2, "0")}</p><h2 className="mt-3 text-xl font-extrabold leading-8 text-foreground">{post.title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-5"><span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground"><Clock3 className="size-3.5" />{post.readingMinutes} دقائق قراءة</span><Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-sm font-extrabold text-primary hover:text-accent">اقرأ المسودة <ArrowLeft className="size-4" /></Link></div>
      </article>)}</div>
    </div></section>
  </PageShell>;
}
