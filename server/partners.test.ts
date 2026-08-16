import { describe, expect, it } from "vitest";
import { PARTNERS } from "../client/src/lib/clinic";

describe("بيانات شركاء النجاح", () => {
  it("تعرض الشركاء ذوي الأسماء المقروءة فقط مع شعارات مرفوعة للتخزين", () => {
    expect(PARTNERS).toHaveLength(16);
    expect(new Set(PARTNERS.map(partner => partner.id)).size).toBe(PARTNERS.length);
    expect(PARTNERS.every(partner => partner.logo.startsWith("/manus-storage/partner-"))).toBe(true);
    expect(PARTNERS.map(partner => partner.id)).not.toContain("arabic-medical-partner");
    expect(PARTNERS.map(partner => partner.id)).not.toContain("medical-symbol");
  });
});
