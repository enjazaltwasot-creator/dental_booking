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
  });

  it("يستخدم طبقات عالية التباين لنصوص البطاقة الزجاجية في الافتتاحية", () => {
    const hero = readFileSync(join(process.cwd(), "client/src/components/FullWidthGroupHero.tsx"), "utf8");

    expect(hero).toContain("bg-slate-950/22");
    expect(hero).toContain("text-white drop-shadow");
    expect(hero).toContain("text-white/92");
    expect(hero).toContain("text-white/85");
  });
});
