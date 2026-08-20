const ASSET_BASE = import.meta.env.VITE_ASSET_BASE || "/manus-storage";
export const asset = (filename: string) => `${ASSET_BASE}/${filename}`;

export const LOGO_SRC = asset("evan-logo_076a049e.webp");
export const HERO_VIDEO_SRC = asset("evan-natural-hero-day-extended_5ec37a01.mp4");

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
    image: asset("evan-mahdiyah-building-enhanced_dec82603.png"),
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
    image: asset("evan-olaya-building-night-enhanced_2f58024a.png"),
    galleryImage: asset("evan-olaya-building-day-enhanced_4ea1abcc.png"),
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
    image: asset("evan-ahmadiyah-building-enhanced_1a2b3264.png"),
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

export const PARTNERS = [
  { id: "aesthetic-pioneers", name: "Aesthetic Pioneers", logo: asset("aesthetic-pioneers_c0b1848f.webp") },
  { id: "ame", name: "AME International", logo: asset("ame_a717f941.webp") },
  { id: "euromi", name: "Euromi", logo: asset("euromi_dffc98b5.webp") },
  { id: "mint-lift", name: "MINT Lift", logo: asset("mint-lift_89389cf6.webp") },
  { id: "exosmart", name: "exosmart", logo: asset("exosmart_23541996.webp") },
  { id: "teoxane", name: "Teoxane", logo: asset("teoxane_7571099b.webp") },
  { id: "clearcaps", name: "clearcaps", logo: asset("clearcaps_1489ca7a.webp") },
  { id: "magellan", name: "Magellan", logo: asset("magellan_931d6a62.webp") },
  { id: "anteage-md", name: "AnteAGE MD", logo: asset("anteage-md_c04a4a43.webp") },
  { id: "deka", name: "DEKA", logo: asset("deka_2ddcc173.webp") },
  { id: "kuos", name: "Kuo's Professional", logo: asset("kuos_c0551d1b.webp") },
  { id: "nabota", name: "Nabota", logo: asset("nabota_a7ac23a0.webp") },
  { id: "promoitalia", name: "Promoitalia", logo: asset("promoitalia_284ffb1a.webp") },
  { id: "splendor-x", name: "Splendor X", logo: asset("splendor-x_b983233c.webp") },
  { id: "madfu", name: "مدفوع", logo: asset("madfu_37d05cad.webp") },
] as const;

export const SPECIALTIES = [
  {
    id: "dentistry",
    number: "01",
    title: "طب الأسنان",
    subtitle: "قسم الأسنان",
    description:
      "رعاية سنية تجمع المسارات العلاجية والتجميلية المتاحة في الموقع، ثم تقودك إلى خطوة حجز واضحة ومباشرة.",
    highlights: ["زراعة الأسنان", "تقويم الأسنان", "ابتسامة هوليود", "تركيبات الأسنان"],
    image: asset("services-overview_66815dcd.jpg"),
    imageAlt: "طبيب يجري فحصاً للأسنان داخل عيادة",
  },
  {
    id: "dermatology-aesthetics",
    number: "02",
    title: "الجلدية والتجميل",
    subtitle: "قسم الجلدية والتجميل",
    description:
      "خدمات مخصصة للعناية بالجلد والتجميل ضمن بيئة طبية منظمة، مع ظهور خيارات تجميلية مثل بروفايلو في الخدمات المعلنة سابقاً.",
    highlights: ["العناية بالجلد", "استشارات تجميلية", "بروفايلو ضمن الخدمات المعلنة"],
    image: asset("clinic-care_9c78a4bb.jpg"),
    imageAlt: "جلسة عناية تجميلية داخل بيئة طبية",
  },
  {
    id: "laser",
    number: "03",
    title: "تقنيات الليزر",
    subtitle: "قسم الليزر",
    description:
      "تقنيات ليزر حديثة تظهر ضمن التخصصات المعلنة للمجموعة، مع تواصل منظم لتحديد الخدمة والفرع والموعد المناسب.",
    highlights: ["تقنيات الليزر", "ليزر الرجال ضمن الخدمات المعلنة", "تنسيق الموعد حسب الفرع"],
    image: asset("laser-care-neutral_0fe7d79f.png"),
    imageAlt: "مراجع يرتدي نظارات واقية خلال جلسة ليزر داخل عيادة",
  },
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
