import { Link } from "wouter";
import { MapPin, Phone } from "lucide-react";
import { BRANCHES, CLINIC, LOGO_SRC } from "@/lib/clinic";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <img src={LOGO_SRC} alt={CLINIC.name} className="h-12 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            {CLINIC.description}
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground">روابط سريعة</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/" className="transition-colors hover:text-primary">الرئيسية</Link></li>
            <li><Link href="/services" className="transition-colors hover:text-primary">خدماتنا</Link></li>
            <li><Link href="/doctors" className="transition-colors hover:text-primary">الأطباء</Link></li>
            <li><Link href="/branches" className="transition-colors hover:text-primary">فروعنا</Link></li>
            <li><Link href="/booking" className="transition-colors hover:text-primary">حجز موعد</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground">فروعنا</h3>
          <ul className="mt-4 space-y-3.5 text-sm text-muted-foreground">
            {BRANCHES.map(branch => (
              <li key={branch.name} className="space-y-1">
                <span className="flex items-center gap-2 font-semibold text-foreground">
                  <MapPin className="size-4 text-primary" />
                  {branch.name}
                </span>
                <span className="flex items-center gap-2 ps-6" dir="ltr">
                  <Phone className="size-3.5 text-primary" />
                  {branch.phone}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {CLINIC.name}. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
