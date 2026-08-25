import { describe, expect, it } from "vitest";
import { extractCampaignAttribution, getBookingBranch } from "../client/src/lib/conversions";

describe("booking conversion helpers", () => {
  it("extracts the selected branch from a booking URL without retaining personal data", () => {
    expect(getBookingBranch("/booking?branch=olaya")).toBe("olaya");
    expect(getBookingBranch("https://evanclinic.sa/booking?branch=mahdiyah")).toBe("mahdiyah");
    expect(getBookingBranch("/booking")).toBe("all");
  });

  it("keeps only recognized campaign parameters and excludes personal booking details", () => {
    expect(extractCampaignAttribution("?utm_source=snapchat&utm_campaign=summer&gclid=abc123&patientPhone=0500000000")).toEqual({ utm_source: "snapchat", utm_campaign: "summer", gclid: "abc123" });
  });
});
