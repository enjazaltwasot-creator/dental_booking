import { MapPin, Phone, Clock } from "lucide-react";
import PageShell from "@/components/PageShell";
import { BRANCHES } from "@/lib/clinic";

export default function Branches() {
  return (
    <PageShell>
      <section className="border-b border-border bg-secondary/30 py-14">
        <div className="container text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">فروعنا</h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-8 text-muted-foreground">
            ثلاثة فروع في مواقع استراتيجية بالرياض لخدمتك بالقرب منك.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container grid gap-5 md:grid-cols-3">
          {BRANCHES.map(branch => (
            <article
              key={branch.name}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <MapPin className="size-5 text-primary" />
                {branch.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{branch.city}</p>
              <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm text-muted-foreground">
                <p className="flex items-center gap-2" dir="ltr">
                  <Phone className="size-4 text-primary" />
                  {branch.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  السبت - الخميس، 9:00 صباحاً - 5:00 مساءً
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

