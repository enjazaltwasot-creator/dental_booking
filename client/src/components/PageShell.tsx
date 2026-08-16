import { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import EvanAssistant from "./EvanAssistant";

export default function PageShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(main.querySelectorAll("section"));
    if (!sections.length) return;

    sections.forEach((section, index) => {
      section.classList.add("page-section-reveal");
      section.style.setProperty("--reveal-delay", `${Math.min(index * 45, 180)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main ref={mainRef} className="page-route-transition flex-1" key={location}>
        {children}
      </main>
      <SiteFooter />
      <EvanAssistant />
    </div>
  );
}
