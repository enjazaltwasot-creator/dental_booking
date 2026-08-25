import { describe, expect, it } from "vitest";
import { getLegacyRedirect } from "./_core/legacyRedirects";

describe("legacy subdomain redirects", () => {
  it("redirects configured legacy hosts with path and query preserved", () => {
    expect(getLegacyRedirect("raheeb.evanclinic.sa", "/blog?utm_source=google", "https://evanclinic.sa")).toBe("https://evanclinic.sa/blog?utm_source=google");
    expect(getLegacyRedirect("marketing.evanclinic.sa.", "/booking", "https://evanclinic.sa")).toBe("https://evanclinic.sa/booking");
  });

  it("does not redirect the canonical host or an unconfigured host", () => {
    expect(getLegacyRedirect("evanclinic.sa", "/")).toBeNull();
    expect(getLegacyRedirect("test.evanclinic.sa", "/")).toBeNull();
  });
});
