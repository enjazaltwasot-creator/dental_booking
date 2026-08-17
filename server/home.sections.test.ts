import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("تكوين الصفحة الرئيسية", () => {
  it("لا يعرض أقسام الشركاء أو الفريق أو التخصصات التي انتقلت إلى صفحات مستقلة", () => {
    const home = readFileSync(join(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(home).not.toContain('id="partners"');
    expect(home).not.toContain('id="doctors"');
    expect(home).not.toContain('id="specialties"');
    expect(home).not.toContain("PARTNERS.map");
    expect(home).not.toContain("DEPARTMENTS.map");
    expect(home).not.toContain("ملفات مهنية لفريقنا الطبي");
    expect(home).toContain('id="faq"');
    expect(home).toContain("const FAQS");
    expect(home).toContain('src="/manus-storage/evan-brand-mark-watermark_a819a58f.png"');
    expect(home).toContain("w-[48%] overflow-hidden");
    expect(home).toContain("h-[15rem] max-w-none");
    expect(home).toContain("brightness-0 invert");
    expect(home).toContain("motion-safe:md:group-hover:scale-105");
    expect(home).toContain("motion-reduce:transition-none");
  });

  it("يعرض محتوى افتتاحية عائماً ذا تباين عالٍ وعلامة إيفان دون بطاقة كبيرة", () => {
    const hero = readFileSync(join(process.cwd(), "client/src/components/FullWidthGroupHero.tsx"), "utf8");

    expect(hero).toContain("EVAN_HERO_LOGO");
    expect(hero).toContain('img src={EVAN_HERO_LOGO}');
    expect(hero).toContain("lg:from-slate-950/78");
    expect(hero).not.toContain("bg-slate-950/22");
    expect(hero).toContain("text-white drop-shadow");
    expect(hero).toContain("border-r-2 border-accent");
    expect(hero).toContain("text-white/90");
    expect(hero).toContain("function AnimatedWords");
    expect(hero).toContain("useReducedMotion");
    expect(hero).toContain("text=\"رعاية متكاملة،\"");
  });
});
