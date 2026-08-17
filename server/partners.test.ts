import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PARTNERS } from "../client/src/lib/clinic";

describe("بيانات شركاء النجاح", () => {
  it("تعرض الشركاء ذوي الأسماء المقروءة فقط مع شعارات مرفوعة للتخزين", () => {
    expect(PARTNERS).toHaveLength(16);
    expect(new Set(PARTNERS.map(partner => partner.id)).size).toBe(PARTNERS.length);
    expect(PARTNERS.every(partner => partner.logo.startsWith("/manus-storage/partner-"))).toBe(true);
    expect(PARTNERS.map(partner => partner.id)).not.toContain("arabic-medical-partner");
    expect(PARTNERS.map(partner => partner.id)).not.toContain("medical-symbol");
  });

  it("يبقي صفحة الشركاء المستقلة مرتبطة بالتنقل والمسار العام دون قسم مكرر بالرئيسية", () => {
    const root = process.cwd();
    const app = readFileSync(join(root, "client/src/App.tsx"), "utf8");
    const header = readFileSync(join(root, "client/src/components/SiteHeader.tsx"), "utf8");
    const home = readFileSync(join(root, "client/src/pages/Home.tsx"), "utf8");

    expect(app).toContain('path="/partners" component={Partners}');
    expect(header).toContain('{ href: "/partners", label: "شركاء النجاح" }');
    expect(home).not.toContain('id="partners"');
    expect(home).not.toContain("PARTNERS.map");
  });
});
