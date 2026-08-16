export const LOGO_SRC = "/manus-storage/evan-logo_076a049e.webp";

export const CLINIC = {
  name: "مجموعة عيادات إيفان الطبية",
  tagline: "لطب الأسنان والجلدية والليزر",
  description:
    "نحرص على تقديم أفضل الخدمات في مجالات طب الأسنان والجلدية وتقنيات الليزر الحديثة، تحت إشراف نخبة من الأطباء ذوي الخبرة والكفاءة.",
} as const;

export const BRANCHES = [
  { name: "فرع حي المهدية", city: "الرياض - غرب الرياض", phone: "0112345678" },
  { name: "فرع حي العليا", city: "الرياض - وسط الرياض", phone: "0112345679" },
  { name: "فرع حي الأحمدية", city: "الرياض - حي الأحمدية (لبن)", phone: "0112345680" },
] as const;

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
