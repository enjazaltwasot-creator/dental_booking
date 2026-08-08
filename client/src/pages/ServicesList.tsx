import { Link } from "wouter";
import { Stethoscope, Timer } from "lucide-react";
import PageShell from "@/components/PageShell";
import { trpc } from "@/lib/trpc";

export default function ServicesList() {
  const { data: services, isLoading } = trpc.services.list.useQuery();

  return (
    <PageShell>
      <section className="border-b border-border bg-secondary/30 py-14">
        <div className="container text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">خدماتنا المتخصصة</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-8 text-muted-foreground">
            مجموعة شاملة من الخدمات الطبية بأحدث التقنيات وعلى يد نخبة من الأطباء.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-52 animate-pulse rounded-2xl border border-border bg-secondary/50" />
              ))}
            </div>
          )}

          {!isLoading && (services?.length ?? 0) === 0 && (
            <p className="py-16 text-center text-muted-foreground">لا توجد خدمات متاحة حالياً.</p>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(services ?? []).map(service => (
              <article
                key={service.id}
                className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Stethoscope className="size-5" />
                </span>
                <h2 className="mt-5 text-lg font-bold text-foreground">{service.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{service.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Timer className="size-3.5" />
                    {service.duration} دقيقة
                  </span>
                  <Link
                    href="/booking"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all duration-200 hover:shadow-md"
                  >
                    احجز
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
