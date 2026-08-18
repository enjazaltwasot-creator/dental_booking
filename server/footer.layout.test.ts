import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const footerSource = readFileSync(new URL("../client/src/components/SiteFooter.tsx", import.meta.url), "utf8");

describe("compact footer layout", () => {
  it("uses a compact spacing scale and keeps branch contacts available", () => {
    expect(footerSource).toContain("gap-7 py-9");
    expect(footerSource).toContain("grid grid-cols-2");
    expect(footerSource).toContain("py-3.5");
    expect(footerSource).toContain("{branch.phone}");
  });
});
