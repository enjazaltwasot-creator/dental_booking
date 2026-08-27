import { lazy, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { MessageCircleMore } from "lucide-react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

const EvanAssistant = lazy(() => import("./EvanAssistant"));

function AssistantLauncher({ onLoad, onOpen, disabled = false }: { onLoad: () => void; onOpen: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      onFocus={onLoad}
      onPointerEnter={onLoad}
      disabled={disabled}
      aria-label="فتح مساعد إيفان"
      className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3.5 text-sm font-extrabold text-accent-foreground shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97] disabled:cursor-wait sm:bottom-6 sm:left-6"
    >
      <MessageCircleMore className="size-5" />
      مساعد إيفان
    </button>
  );
}

function DeferredEvanAssistant() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [openOnLoad, setOpenOnLoad] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShouldLoad(true), 5_000);
    return () => window.clearTimeout(timer);
  }, []);

  const loadAndOpen = () => {
    setOpenOnLoad(true);
    setShouldLoad(true);
  };

  if (!shouldLoad) return <AssistantLauncher onLoad={() => setShouldLoad(true)} onOpen={loadAndOpen} />;
  return (
    <Suspense fallback={<AssistantLauncher onLoad={() => undefined} onOpen={() => undefined} disabled />}>
      <EvanAssistant initialOpen={openOnLoad} />
    </Suspense>
  );
}

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
      <DeferredEvanAssistant />
    </div>
  );
}
