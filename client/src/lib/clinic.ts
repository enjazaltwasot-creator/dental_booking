export const LOGO_SRC = "/manus-storage/evan-logo_076a049e.webp";

export const CLINIC = {
  name: "مجموعة عيادات إيفان الطبية",
  tagline: "لطب الأسنان والجلدية والليزر",
  description:
    "نحرص على تقديم أفضل الخدمات في مجالات طب الأسنان والجلدية وتقنيات الليزر الحديثة، تحت إشراف نخبة من الأطباء ذوي الخبرة والكفاءة.",
} as const;

export const BRANCHES = [
  {
    slug: "mahdiyah",
    name: "فرع حي المهدية",
    shortName: "المهدية",
    city: "الرياض — غرب الرياض",
    address: "حي المهدية، غرب الرياض",
    phone: "0112345678",
    route: "/branches/al-mahdiyah",
    bookingPath: "/booking?branch=mahdiyah",
    mapUrl: "https://maps.app.goo.gl/ikvDqxtpXo7NRkXZ9",
    mapEmbedUrl: "https://www.google.com/maps?q=24.6553724,46.5126144&z=15&output=embed",
    coordinates: { lat: 24.6553724, lng: 46.5126144 },
    image: "/manus-storage/evan-mahdiyah-building-enhanced_dec82603.png",
    galleryImage: undefined,
    imageAlt: "واجهة مبنى مجمع إيفان الطبي في فرع حي المهدية",
  },
  {
    slug: "olaya",
    name: "فرع حي العليا",
    shortName: "العليا",
    city: "الرياض — وسط الرياض",
    address: "عماير السيركون، شارع موسى بن نصير، العليا",
    phone: "0112345679",
    route: "/branches/al-olaya",
    bookingPath: "/booking?branch=olaya",
    mapUrl: "https://maps.app.goo.gl/7J85tT4cWz7aJqjS6",
    mapEmbedUrl: "https://www.google.com/maps?q=24.7046584,46.6840428&z=15&output=embed",
    coordinates: { lat: 24.7046584, lng: 46.6840428 },
    image: "/manus-storage/evan-olaya-building-night-enhanced_2f58024a.png",
    galleryImage: "/manus-storage/evan-olaya-building-day-enhanced_4ea1abcc.png",
    imageAlt: "واجهة مبنى مجمع إيفان الطبي في فرع حي العليا",
  },
  {
    slug: "ahmadiyah-laban",
    name: "فرع حي الأحمدية — لبن",
    shortName: "الأحمدية — لبن",
    city: "الرياض — الأحمدية (لبن)",
    address: "حي الأحمدية، لبن، غرب الرياض",
    phone: "0112345680",
    route: "/branches/al-ahmadiyah-laban",
    bookingPath: "/booking?branch=ahmadiyah-laban",
    mapUrl: "https://maps.app.goo.gl/ZroSiioybrMx1UiA8",
    mapEmbedUrl: "https://www.google.com/maps?q=24.6310446,46.6094759&z=15&output=embed",
    coordinates: { lat: 24.6310446, lng: 46.6094759 },
    image: "/manus-storage/evan-ahmadiyah-building-enhanced_1a2b3264.png",
    galleryImage: undefined,
    imageAlt: "واجهة مبنى مجمع إيفان الطبي في فرع حي الأحمدية لبن",
  },
] as const;

export type Branch = (typeof BRANCHES)[number];
export type BranchSlug = Branch["slug"];

export function getBranchBySlug(slug: string | undefined) {
  return BRANCHES.find(branch => branch.slug === slug);
}

export function getBranchByRouteSegment(segment: string | undefined) {
  return BRANCHES.find(branch => branch.route === `/branches/${segment}`);
}

export const DEPARTMENTS = [
  "قسم الأسنان",
  "قسم الجلدية والتجميل",
  "قسم الليزر",
] as const;

export const STATUS_META: Record<
  "pending" | "confirmed" | "cancelled",
  { label: string; className: string }
> = {
  pending: {
    label: "معلق",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  confirmed: {
    label: "مؤكد",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  cancelled: {
    label: "ملغى",
    className: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  },
};

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function toDateInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
