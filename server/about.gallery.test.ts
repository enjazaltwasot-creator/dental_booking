import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const aboutSource = readFileSync(new URL("../client/src/pages/About.tsx", import.meta.url), "utf8");

describe("about branch gallery", () => {
  it("uses one daytime image per branch", () => {
    expect(aboutSource).toContain("const BRANCH_SLIDES = BRANCHES.map");
    expect(aboutSource).not.toContain("branch.galleryImage");
  });

  it("shows one full-width branch slide and advances automatically", () => {
    expect(aboutSource).toContain('className="basis-full pl-0"');
    expect(aboutSource).toContain("h-[460px]");
    expect(aboutSource).toContain("carouselApi.scrollNext()");
    expect(aboutSource).toContain("5500");
    expect(aboutSource).toContain("prefers-reduced-motion: reduce");
  });
});
