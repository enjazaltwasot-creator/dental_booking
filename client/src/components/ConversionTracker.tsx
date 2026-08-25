import { useEffect } from "react";
import { useLocation } from "wouter";
import { getBookingBranch, rememberCampaignAttribution, trackBookingConversion } from "@/lib/conversions";

export default function ConversionTracker() {
  const [location] = useLocation();

  useEffect(() => {
    rememberCampaignAttribution();
    const bookingLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="/booking"]'));
    bookingLinks.forEach(link => {
      link.dataset.conversion = "booking_start";
      link.dataset.branch = getBookingBranch(link.getAttribute("href") || "/booking");
    });
  }, [location]);

  useEffect(() => {
    const onBookingLinkClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-conversion="booking_start"]') : null;
      if (!target) return;
      trackBookingConversion({
        conversion: "booking_start",
        branch: target.dataset.branch || "all",
      });
    };
    document.addEventListener("click", onBookingLinkClick);
    return () => document.removeEventListener("click", onBookingLinkClick);
  }, []);

  return null;
}
