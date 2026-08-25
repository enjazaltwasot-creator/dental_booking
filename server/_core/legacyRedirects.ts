const CANONICAL_ORIGIN = "https://evanclinic.sa";
const LEGACY_HOSTS = new Set(["raheeb.evanclinic.sa", "marketing.evanclinic.sa"]);

export function getLegacyRedirect(hostname: string, originalUrl: string, canonicalOrigin = process.env.CANONICAL_ORIGIN || CANONICAL_ORIGIN) {
  const normalizedHost = hostname.toLowerCase().replace(/\.$/, "");
  if (!LEGACY_HOSTS.has(normalizedHost)) return null;
  return `${canonicalOrigin.replace(/\/$/, "")}${originalUrl.startsWith("/") ? originalUrl : `/${originalUrl}`}`;
}
