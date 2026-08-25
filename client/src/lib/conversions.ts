export type BookingConversion = {
  branch: string;
  conversion: "booking_start" | "booking_confirmed";
  source?: string;
  serviceId?: number;
};

export type CampaignAttribution = Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content" | "gclid" | "fbclid" | "msclkid", string>;

const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid"] as const;
const CAMPAIGN_STORAGE_KEY = "evan-campaign-attribution";

export function extractCampaignAttribution(search: string): Partial<CampaignAttribution> {
  const params = new URLSearchParams(search);
  return CAMPAIGN_KEYS.reduce<Partial<CampaignAttribution>>((result, key) => {
    const value = params.get(key)?.trim();
    if (value) result[key] = value.slice(0, 180);
    return result;
  }, {});
}

export function rememberCampaignAttribution(search = window.location.search) {
  if (typeof window === "undefined") return;
  const attribution = extractCampaignAttribution(search);
  if (Object.keys(attribution).length) window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(attribution));
}

function getCampaignAttribution(): Partial<CampaignAttribution> {
  if (typeof window === "undefined") return {};
  try {
    const saved = JSON.parse(window.localStorage.getItem(CAMPAIGN_STORAGE_KEY) || "{}");
    return typeof saved === "object" && saved ? saved as Partial<CampaignAttribution> : {};
  } catch {
    return {};
  }
}

export function getBookingBranch(href: string): string {
  try {
    return new URL(href, "https://evanclinic.sa").searchParams.get("branch") || "all";
  } catch {
    return "all";
  }
}

export function trackBookingConversion(conversion: BookingConversion) {
  if (typeof window === "undefined") return;
  const trackedWindow = window as typeof window & { dataLayer?: Array<Record<string, unknown>> };
  trackedWindow.dataLayer = trackedWindow.dataLayer || [];
  trackedWindow.dataLayer.push({
    event: "evan_booking_conversion",
    ...conversion,
    ...getCampaignAttribution(),
  });
}
