import { Link } from "wouter";
import { Mail, Phone } from "lucide-react";
import PageShell from "@/components/PageShell";
import { trpc } from "@/lib/trpc";

export default function DoctorsList() {
  const { data: dentists, isLoading } = trpc.dentists.list.useQuery();

  return (
    <PageShell>
      <section className="border-b border-border bg-secondary/30 py-14">
        <div className="container text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">فريقنا الطبي</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-8 text-muted-foreground">
            أطباء متخصصون بخبرة عالية وكفاءة مثبتة في مختلف المجالات الطبية.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-64 animate-pulse rounded-2xl border border-border bg-secondary/50" />
              ))}
            </div>
          )}

          {!isLoading && (dentists?.length ?? 0) === 0 && (
            <p className="py-16 text-center text-muted-foreground">لا يوجد أطباء متاحون حالياً.</p>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(dentists ?? []).map(doctor => (
              <article
                key={doctor.id}
                className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-extrabold text-primary">
                    {doctor.name.replace("د.", "").trim().charAt(0)}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-foreground">{doctor.name}</h2>
                    <p className="mt-0.5 text-sm font-semibold text-primary">{doctor.specialization}</p>
                  </div>
                </div>

                {doctor.bio && (
                  <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{doctor.bio}</p>
                )}

                <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                  {doctor.phone && (
                    <p className="flex items-center gap-2" dir="ltr">
                      <Phone className="size-4 text-primary" />
                      {doctor.phone}
                    </p>
                  )}
                  {doctor.email && (
                    <p className="flex items-center gap-2" dir="ltr">
                      <Mail className="size-4 text-primary" />
                      {doctor.email}
                    </p>
                  )}
                </div>

                <Link
                  href="/booking"
                  className="mt-5 rounded-xl bg-primary py-3 text-center text-sm font-bold text-primary-foreground transition-all duration-200 hover:shadow-md"
                >
                  احجز مع الطبيب
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
