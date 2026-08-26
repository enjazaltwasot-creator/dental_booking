import { campaignAsset, type BranchSlug } from "@/lib/clinic";

export const LANDING_CONTACTS: Record<BranchSlug, { phone: string; whatsapp: string }> = {
  mahdiyah: { phone: "+966593255298", whatsapp: "966593255298" },
  olaya: { phone: "+966591241388", whatsapp: "966591241388" },
  "ahmadiyah-laban": { phone: "+966533759908", whatsapp: "966533759908" },
};

export const NATIONAL_DAY_OFFERS = [
  {
    id: "implant-crown",
    image: campaignAsset("/manus-storage/national-day-implant-crown_cf674135.jpg", "national-day-implant-crown.jpg"),
    alt: "عرض اليوم الوطني لزراعة الأسنان والتركيبة",
  },
  {
    id: "scarlet-plasma",
    image: campaignAsset("/manus-storage/national-day-scarlet-plasma_4fdef933.jpg", "national-day-scarlet-plasma.jpg"),
    alt: "عرض اليوم الوطني لجلسات سكارليت وبلازما الشعر",
  },
  {
    id: "groom-package",
    image: campaignAsset("/manus-storage/national-day-groom-package_2e5a5ca8.jpg", "national-day-groom-package.jpg"),
    alt: "عرض اليوم الوطني لبكج العريس",
  },
  {
    id: "full-body-laser",
    image: campaignAsset("/manus-storage/national-day-full-body-laser_59a5d7c9.jpg", "national-day-full-body-laser.jpg"),
    alt: "عرض اليوم الوطني لجلسات ليزر الجسم",
  },
  {
    id: "full-jaw-implant",
    image: campaignAsset("/manus-storage/national-day-full-jaw-implant_d855e1c3.jpg", "national-day-full-jaw-implant.jpg"),
    alt: "عرض اليوم الوطني لزراعة الفك الكامل",
  },
  {
    id: "filler-botox",
    image: campaignAsset("/manus-storage/national-day-filler-botox_0eca68aa.jpg", "national-day-filler-botox.jpg"),
    alt: "عرض اليوم الوطني للفيلر والبوتوكس",
  },
  {
    id: "bride-package",
    image: campaignAsset("/manus-storage/national-day-bride-package_9598f475.jpg", "national-day-bride-package.jpg"),
    alt: "عرض اليوم الوطني لبكج العروسة",
  },
] as const;

export const BRANCH_CASES: Partial<Record<BranchSlug, Array<{ id: string; image: string; alt: string; title: string }>>> = {
  olaya: [
    {
      id: "olaya-smile",
      image: campaignAsset("/manus-storage/olaya-smile-before-after_f4945a2d.jpg", "olaya-smile-before-after.jpg"),
      alt: "حالة أسنان قبل وبعد في فرع العليا",
      title: "حالة أسنان قبل وبعد",
    },
  ],
  "ahmadiyah-laban": [
    {
      id: "ahmadiyah-braces",
      image: campaignAsset("/manus-storage/ahmadiyah-braces-before-after_c66dcf5a.jpg", "ahmadiyah-braces-before-after.jpg"),
      alt: "حالة تقويم أسنان قبل وبعد في فرع الأحمدية لبن",
      title: "حالة تقويم أسنان قبل وبعد",
    },
    {
      id: "ahmadiyah-smile",
      image: campaignAsset("/manus-storage/ahmadiyah-smile-before-after_fe9c18aa.jpg", "ahmadiyah-smile-before-after.jpg"),
      alt: "حالة تجميل أسنان قبل وبعد في فرع الأحمدية لبن",
      title: "حالة تجميل أسنان قبل وبعد",
    },
  ],
};

export const BRANCH_DOCTORS: Partial<Record<BranchSlug, Array<{ id: string; name: string; specialty: string; image?: string; alt?: string }>>> = {
  "ahmadiyah-laban": [
    {
      id: "eman-imbary",
      name: "د. إيمان إمباري",
      specialty: "الجلدية والتجميل والليزر",
      image: campaignAsset("/manus-storage/doctor-eman-imbary-case_11e3d4a9.jpg", "doctor-eman-imbary-case.jpg"),
      alt: "د. إيمان إمباري، أخصائي الجلدية والتجميل والليزر",
    },
    {
      id: "naseem-maraqa",
      name: "د. نسيم مرقة",
      specialty: "خدمات الأسنان",
    },
  ],
};
