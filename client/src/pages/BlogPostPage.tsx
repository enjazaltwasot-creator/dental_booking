import { ArrowLeft, BookOpenCheck, CalendarPlus, Clock3, ExternalLink, Share2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Link, useRoute } from "wouter";
import PageShell from "@/components/PageShell";
import NotFound from "@/pages/NotFound";
import { getBlogPost } from "@shared/blog";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const post = getBlogPost(params?.slug);
  const [shareNote, setShareNote] = useState("");
  if (!post) return <NotFound />;
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: post.title, text: post.description, url });
    else { await navigator.clipboard?.writeText(url); setShareNote("تم نسخ رابط المسودة."); }
  };
  return <PageShell>
    <article>
      <header className="border-b border-primary/10 bg-secondary/35 py-14 sm:py-20"><div className="container max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent"><ArrowLeft className="size-4" />العودة إلى المدونة</Link>
        <div className="mt-7 flex flex-wrap items-center gap-3"><span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary">{post.category}</span><span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground"><Clock3 className="size-3.5" />{post.readingMinutes} دقائق قراءة</span><span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-800">قيد الاعتماد الطبي</span></div>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">{post.title}</h1><p className="mt-5 max-w-3xl text-[16px] leading-8 text-muted-foreground">{post.description}</p>
        <div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={() => void share()} className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm font-extrabold text-primary transition-colors hover:bg-primary/5"><Share2 className="size-4" />مشاركة</button>{shareNote && <span className="self-center text-sm font-bold text-emerald-700">{shareNote}</span>}</div>
      </div></header>
      <section className="py-12 sm:py-16"><div className="container max-w-3xl">
        <aside className="mb-10 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950"><ShieldAlert className="mt-0.5 size-5 shrink-0" /><p><strong>تنبيه توعوي:</strong> هذه مسودة معلومات عامة، وليست تشخيصاً أو وصفة أو قراراً علاجياً. راجع مختصاً مؤهلاً للحصول على تقييم يناسب حالتك.</p></aside>
        <div className="space-y-10">{post.sections.map(section => <section key={section.heading}><h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">{section.heading}</h2><div className="mt-4 space-y-4 text-[15px] leading-8 text-muted-foreground">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></section>)}</div>
        <section className="mt-12 rounded-3xl bg-primary p-7 text-white sm:p-8"><BookOpenCheck className="size-6 text-orange-200" /><h2 className="mt-4 text-2xl font-extrabold">مراجع للقراءة العامة</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-white/85">{post.references.map(reference => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 underline decoration-white/35 underline-offset-4 hover:text-orange-200">{reference.label}<ExternalLink className="size-3.5" /></a></li>)}</ul></section>
        <section className="mt-8 flex flex-col gap-4 rounded-3xl border border-primary/10 bg-secondary/40 p-7 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-extrabold text-primary">هل تريد معرفة خيارات الحجز المتاحة؟</p><p className="mt-1 text-sm leading-7 text-muted-foreground">ابدأ باختيار الفرع والخدمة والطبيب والموعد المتاح.</p></div><Link href="/booking" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-extrabold text-accent-foreground"><CalendarPlus className="size-4" />ابدأ الحجز</Link></section>
      </div></section>
    </article>
  </PageShell>;
}
