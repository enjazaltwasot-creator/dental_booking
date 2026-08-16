import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, CalendarPlus, ChevronDown } from "lucide-react";
import { LOGO_SRC } from "@/lib/clinic";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#vision", label: "رؤيتنا" },
  { href: "/#specialties", label: "تخصصاتنا" },
  { href: "/#doctors", label: "الأطباء" },
  { href: "/#partners", label: "شركاء النجاح" },
];

const BRANCH_LINKS = [
  { href: "/branches#mahdiyah", label: "فرع المهدية" },
  { href: "/branches#olaya", label: "فرع العليا" },
  { href: "/branches#ahmadiyah", label: "فرع الأحمدية — لبن" },
];

export default function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center">
          <img src={LOGO_SRC} alt="مجموعة عيادات إيفان الطبية" className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className={cn(
              "relative rounded-lg px-3 py-2 text-[15px] font-medium transition-colors duration-200 lg:px-4",
              location === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            الرئيسية
            {location === "/" && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              type="button"
              onClick={() => setAboutOpen(value => !value)}
              onFocus={() => setAboutOpen(true)}
              aria-expanded={aboutOpen}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors duration-200 lg:px-4",
                location === "/#about" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              من نحن
              <ChevronDown className={cn("size-3.5 transition-transform duration-200", aboutOpen && "rotate-180")} />
            </button>
            <div
              className={cn(
                "absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-border bg-white p-2 shadow-xl shadow-slate-900/10 transition-all duration-200",
                aboutOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
              )}
            >
              <Link href="/#about" onClick={() => setAboutOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-extrabold text-primary transition-all duration-200 hover:-translate-x-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-sm focus-visible:-translate-x-0.5 focus-visible:bg-primary focus-visible:text-primary-foreground">
                عن المجموعة
              </Link>
              <div className="my-1 border-t border-border" />
              {BRANCH_LINKS.map(branch => (
                <Link key={branch.href} href={branch.href} onClick={() => setAboutOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-x-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-sm focus-visible:-translate-x-0.5 focus-visible:bg-primary focus-visible:text-primary-foreground">
                  {branch.label}
                </Link>
              ))}
            </div>
          </div>
          {NAV_LINKS.map(link => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-[15px] font-medium transition-colors duration-200 lg:px-4",
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
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="container flex flex-col py-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-[15px] font-extrabold text-foreground transition-colors hover:bg-secondary"
            >
              الرئيسية
            </Link>
            <div className="rounded-lg px-3 py-3 text-[15px] font-extrabold text-foreground">من نحن</div>
            <div className="mr-3 mb-2 border-r-2 border-primary/15 pr-3">
              <Link href="/#about" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary transition-all duration-200 active:bg-primary active:text-primary-foreground">
                عن المجموعة
              </Link>
              {BRANCH_LINKS.map(branch => (
                <Link key={branch.href} href={branch.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 active:translate-x-0.5 active:bg-primary active:text-primary-foreground">
                  {branch.label}
                </Link>
              ))}
            </div>
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
