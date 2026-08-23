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

  it("keeps direct booking and directions calls to action", () => {
    expect(landingSource).toContain("branch.bookingPath");
    expect(landingSource).toContain("branch.mapUrl");
    expect(landingSource).toContain("احجز موعدك الآن");
  });

  it("registers the ad landing route without adding it to site navigation", () => {
    expect(appSource).toContain('<Route path="/go/:slug" component={BranchLanding} />');
  });
});
