import { describe, expect, it } from "vitest";
import { getHeroVideoLoadDelay } from "./FullWidthGroupHero";

describe("hero video loading policy", () => {
  it("defers the background video beyond the mobile LCP window", () => {
    expect(getHeroVideoLoadDelay(375)).toBe(5_500);
  });

  it("keeps the animated presentation available sooner on larger screens", () => {
    expect(getHeroVideoLoadDelay(1280)).toBe(1_200);
  });
});
