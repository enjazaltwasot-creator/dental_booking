import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("public-site editorial copy", () => {
  it("uses a clear booking journey in the main hero and homepage", () => {
    const hero = readSource("../client/src/components/FullWidthGroupHero.tsx");
    const home = readSource("../client/src/pages/Home.tsx");

    expect(hero).toContain("ابدأ بالفرع، ثم حدّد الخدمة والطبيب والوقت المتاح");
    expect(hero).toContain("ابدأ الحجز");
    expect(home).toContain("خطوات حجز واضحة");
    expect(home).toContain("قيد المراجعة");
    expect(home).not.toContain("تجربة منظمة وواضحة");
  });

  it("keeps service and branch calls to action specific and non-exaggerated", () => {
    const branches = readSource("../client/src/pages/Branches.tsx");
    const services = readSource("../client/src/pages/ServicesList.tsx");
    const header = readSource("../client/src/components/SiteHeader.tsx");
    const vision = readSource("../client/src/pages/Vision.tsx");
    const partners = readSource("../client/src/pages/Partners.tsx");
    const doctors = readSource("../client/src/pages/DoctorsList.tsx");
    const branchDetail = readSource("../client/src/pages/BranchDetail.tsx");

    expect(branches).toContain("ثلاثة فروع في الرياض لتختار الموقع الأقرب إليك.");
    expect(branches).not.toContain("مواقع استراتيجية");
    expect(services).toContain("قبل إرسال طلب الحجز");
    expect(services).toContain(">ابدأ الحجز <");
    expect(header).toContain("ابدأ الحجز");
    expect(vision).toContain("قبل إرسال طلب الحجز");
    expect(vision).toContain("ابدأ الحجز");
    expect(partners).toContain("قبل إرسال طلب الحجز");
    expect(partners).toContain("ابدأ الحجز");
    expect(doctors).toContain("ابدأ الحجز");
    expect(doctors).not.toContain("استمر إلى الحجز");
    expect(branchDetail).toContain("ابدأ الحجز من هذا الفرع");
    expect(branchDetail).toContain("اختر الخدمة والطبيب والوقت المتاح");
  });
});
