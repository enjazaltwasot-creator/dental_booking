import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, CalendarPlus } from "lucide-react";
import { LOGO_SRC } from "@/lib/clinic";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "خدماتنا" },
  { href: "/doctors", label: "الأطباء" },
  { href: "/branches", label: "فروعنا" },
];

export default function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center">
          <img src={LOGO_SRC} alt="مجموعة عيادات إيفان الطبية" className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(link => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-4 py-2 text-[15px] font-medium transition-colors duration-200",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/booking"
            className="hidden items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-sm transition-all duration-200 hover:shadow-md sm:inline-flex"
          >
            <CalendarPlus className="size-4" />
            حجز موعد
          </Link>

          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label="القائمة"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="container flex flex-col py-3">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-accent px-4 py-3 text-center text-sm font-bold text-accent-foreground"
            >
              حجز موعد
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
