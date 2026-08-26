import { Link } from "wouter";
import { AtSign, Facebook, Ghost, Instagram, MapPin, Navigation } from "lucide-react";
import { BRANCHES, CLINIC, LOGO_SRC } from "@/lib/clinic";

const SOCIAL_LINKS = [
  { label: "إنستغرام", href: "https://www.instagram.com/ivan.clinicksa/", icon: Instagram },
  { label: "فيسبوك", href: "https://www.facebook.com/ivanclinicksa/", icon: Facebook },
  { label: "سناب شات", href: "https://www.snapchat.com/add/ivandental", icon: Ghost },
  { label: "ثريدز", href: "https://www.threads.com/@ivan.clinicksa", icon: AtSign },
] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container grid gap-7 py-9 lg:grid-cols-[1.2fr_.7fr_1fr] lg:items-start">
        <div>
          <img src={LOGO_SRC} alt={CLINIC.name} className="h-9 w-auto" />
          <p className="mt-3 max-w-md text-xs leading-6 text-muted-foreground">
            {CLINIC.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="ml-1 text-xs font-extrabold text-foreground">تابعنا</span>
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="grid size-9 place-items-center rounded-full border border-primary/15 bg-white text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white active:scale-[0.97]"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
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
                <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary transition-colors hover:text-accent">
                  <Navigation className="size-3" />
                  الموقع
                </a>
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
