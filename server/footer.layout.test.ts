import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const footerSource = readFileSync(new URL("../client/src/components/SiteFooter.tsx", import.meta.url), "utf8");

describe("compact footer layout", () => {
  it("uses a compact spacing scale and keeps verified branch location links available", () => {
    expect(footerSource).toContain("gap-7 py-9");
    expect(footerSource).toContain("grid grid-cols-2");
    expect(footerSource).toContain("py-3.5");
    expect(footerSource).toContain("href={branch.mapUrl}");
    expect(footerSource).not.toContain("{branch.phone}");
  });

  it("shows accessible links to the approved social profiles", () => {
    expect(footerSource).toContain("https://www.instagram.com/ivan.clinicksa/");
    expect(footerSource).toContain("https://www.facebook.com/ivanclinicksa/");
    expect(footerSource).toContain("https://www.snapchat.com/add/ivandental");
    expect(footerSource).toContain("https://www.threads.com/@ivan.clinicksa");
    expect(footerSource).toContain('aria-label={label}');
  });
});
