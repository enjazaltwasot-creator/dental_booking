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
  });
});
