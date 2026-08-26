import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const landingSource = readFileSync(resolve(projectRoot, "client/src/pages/BranchLanding.tsx"), "utf8");
const appSource = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");

describe("branch advertising landing pages", () => {
  it("uses a standalone landing layout instead of the site shell", () => {
    expect(landingSource).not.toContain("PageShell");
    expect(landingSource).toContain('useRoute("/go/:slug")');
  });

  it("uses branch-specific contact and WhatsApp calls to action instead of booking", () => {
    expect(landingSource).not.toContain("branch.bookingPath");
    expect(landingSource).toContain("branch.mapUrl");
    expect(landingSource).toContain("LANDING_CONTACTS");
    expect(landingSource).toContain("https://wa.me/");
    expect(landingSource).toContain("راسلنا على واتساب");
    expect(landingSource).toContain("اتصل الآن");
  });

  it("includes the approved campaign and case-study sections", () => {
    expect(landingSource).toContain("NATIONAL_DAY_OFFERS");
    expect(landingSource).toContain("BRANCH_CASES");
    expect(landingSource).toContain("BRANCH_DOCTORS");
    expect(landingSource).toContain("النتائج تختلف من حالة لأخرى");
  });

  it("registers the ad landing route without adding it to site navigation", () => {
    expect(appSource).toContain('<Route path="/go/:slug" component={BranchLanding} />');
  });
});
