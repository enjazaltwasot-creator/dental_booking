import { Link } from "wouter";
import { MapPin, Phone } from "lucide-react";
import { BRANCHES, CLINIC, LOGO_SRC } from "@/lib/clinic";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container grid gap-7 py-9 lg:grid-cols-[1.2fr_.7fr_1fr] lg:items-start">
        <div>
          <img src={LOGO_SRC} alt={CLINIC.name} className="h-9 w-auto" />
          <p className="mt-3 max-w-md text-xs leading-6 text-muted-foreground">
            {CLINIC.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-foreground">روابط سريعة</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <li><Link href="/" className="transition-colors hover:text-primary">الرئيسية</Link></li>
            <li><Link href="/services" className="transition-colors hover:text-primary">خدماتنا</Link></li>
            <li><Link href="/doctors" className="transition-colors hover:text-primary">الأطباء</Link></li>
            <li><Link href="/branches" className="transition-colors hover:text-primary">فروعنا</Link></li>
            <li><Link href="/booking" className="transition-colors hover:text-primary">حجز موعد</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-foreground">فروعنا</h3>
          <ul className="mt-3 grid gap-2 text-xs text-muted-foreground">
            {BRANCHES.map(branch => (
              <li key={branch.slug} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1.5 font-bold text-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  {branch.name}
                </span>
                <span className="flex items-center gap-1" dir="ltr">
                  <Phone className="size-3 text-primary" />
                  {branch.phone}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-3.5">
        <p className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {CLINIC.name}. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
