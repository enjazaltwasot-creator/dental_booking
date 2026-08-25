import type { Express } from "express";

const DEFAULT_ORIGIN = "https://evanclinic.sa";
const SITE_NAME = "مجموعة عيادات إيفان الطبية";
const SITE_DESCRIPTION = "مجموعة عيادات إيفان الطبية في الرياض لطب الأسنان والجلدية والليزر، مع فروع في المهدية والعليا والأحمدية لبن وحجز موعد إلكتروني.";
const LOGO_PATH = "/assets/evan-logo_076a049e.webp";

type BranchMeta = {
  slug: string;
  name: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
};

const BRANCHES: BranchMeta[] = [
  { slug: "mahdiyah", name: "فرع حي المهدية", district: "غرب الرياض", address: "حي المهدية، غرب الرياض", lat: 24.6553724, lng: 46.5126144, image: "/assets/evan-mahdiyah-building-enhanced_dec82603.png" },
  { slug: "olaya", name: "فرع حي العليا", district: "وسط الرياض", address: "عماير السيركون، شارع موسى بن نصير، العليا، الرياض", lat: 24.7046584, lng: 46.6840428, image: "/assets/evan-olaya-building-night-enhanced_2f58024a.png" },
  { slug: "ahmadiyah-laban", name: "فرع حي الأحمدية — لبن", district: "الأحمدية، لبن", address: "حي الأحمدية، لبن، غرب الرياض", lat: 24.6310446, lng: 46.6094759, image: "/assets/evan-ahmadiyah-building-enhanced_1a2b3264.png" },
];

type PageMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  noindex?: boolean;
  branch?: BranchMeta;
  heading: string;
  summary: string;
};

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const normalizePath = (rawUrl: string) => {
  const path = rawUrl.split("?")[0].replace(/\/+$/, "") || "/";
  return path;
};

const getOrigin = () => (process.env.CANONICAL_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, "");

function getPageMeta(rawUrl: string): PageMeta {
  const path = normalizePath(rawUrl);
  const branchSlug = path.match(/^\/(?:branches\/al-|go\/)(mahdiyah|olaya|ahmadiyah-laban)$/)?.[1];
  const branch = BRANCHES.find(item => item.slug === branchSlug);
  if (branch) {
    return {
      title: `${branch.name} في الرياض | ${SITE_NAME}`,
      description: `${branch.name} في ${branch.district}. ${SITE_NAME} لطب الأسنان والجلدية والليزر مع إمكانية حجز موعد وفتح الاتجاهات بسهولة.`,
      canonicalPath: `/branches/al-${branch.slug}`,
      image: branch.image,
      branch,
      heading: branch.name,
      summary: `خدمات الأسنان والجلدية والليزر في ${branch.address}. اختر الخدمة والطبيب والموعد المناسب عبر الحجز الإلكتروني.`,
    };
  }

  const pages: Record<string, PageMeta> = {
    "/": { title: `${SITE_NAME} | أسنان وجلدية وليزر في الرياض`, description: SITE_DESCRIPTION, canonicalPath: "/", image: "/assets/evan-natural-hero-day-extended_5ec37a01.mp4", heading: SITE_NAME, summary: "خدمات الأسنان والجلدية والليزر ضمن تجربة حجز موحدة في فروع الرياض." },
    "/about": { title: `عن ${SITE_NAME}`, description: "تعرّف على مجموعة عيادات إيفان الطبية وفروعها وخدماتها في الرياض.", canonicalPath: "/about", heading: "عن مجموعة عيادات إيفان الطبية", summary: "منظومة طبية تجمع طب الأسنان والجلدية والليزر ضمن تجربة واضحة للمراجع." },
    "/vision": { title: `رؤية ${SITE_NAME}`, description: "رؤية مجموعة عيادات إيفان الطبية لتجربة رعاية واضحة وقريبة من احتياج المراجع.", canonicalPath: "/vision", heading: "رؤيتنا", summary: "رعاية طبية أوضح وأقرب عبر تخصصات محددة وفروع سهلة الوصول وحجز منظم." },
    "/specialties": { title: `تخصصات ${SITE_NAME} | أسنان وجلدية وليزر`, description: "تخصصات طب الأسنان والجلدية والليزر في مجموعة عيادات إيفان الطبية بالرياض.", canonicalPath: "/specialties", heading: "تخصصاتنا", summary: "طب الأسنان والجلدية والتجميل وتقنيات الليزر ضمن منظومة رعاية واحدة." },
    "/services": { title: `خدمات ${SITE_NAME} | أسنان وجلدية وليزر`, description: "استعرض خدمات الأسنان والجلدية والليزر واحجز الموعد المناسب في أحد فروع إيفان بالرياض.", canonicalPath: "/specialties", heading: "خدمات إيفان الطبية", summary: "اختر التخصص والخدمة والفرع والطبيب والموعد ضمن رحلة حجز رقمية واضحة." },
    "/branches": { title: `فروع ${SITE_NAME} في الرياض`, description: "فروع مجموعة عيادات إيفان الطبية في المهدية والعليا والأحمدية لبن بالرياض.", canonicalPath: "/branches", heading: "فروعنا في الرياض", summary: "ثلاثة فروع في الرياض لتختار الموقع الأقرب لك وتبدأ الحجز الإلكتروني." },
    "/doctors": { title: `أطباء ${SITE_NAME}`, description: "تعرّف على فريق أطباء مجموعة عيادات إيفان الطبية وخدماتهم وفروعهم المتاحة للحجز.", canonicalPath: "/doctors", heading: "فريقنا الطبي", summary: "اختر طبيباً محدداً أو اعثر على أقرب طبيب متاح حسب الخدمة والفرع والموعد." },
    "/partners": { title: `شركاء النجاح | ${SITE_NAME}`, description: "شركاء النجاح في مجموعة عيادات إيفان الطبية.", canonicalPath: "/partners", heading: "شركاء النجاح", summary: "شراكات تدعم منظومة الخدمات والتقنيات الطبية في إيفان." },
    "/booking": { title: `حجز موعد | ${SITE_NAME}`, description: "احجز موعداً في فروع إيفان بالرياض باختيار الفرع ونوع الرعاية والخدمة والطبيب والوقت.", canonicalPath: "/booking", noindex: true, heading: "حجز موعد", summary: "ابدأ باختيار الفرع ثم الخدمة والطبيب والموعد المناسب." },
  };
  return pages[path] ?? { title: SITE_NAME, description: SITE_DESCRIPTION, canonicalPath: path, noindex: true, heading: SITE_NAME, summary: SITE_DESCRIPTION };
}

function pageSchema(meta: PageMeta, origin: string) {
  const base = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: origin,
    logo: `${origin}${LOGO_PATH}`,
    areaServed: { "@type": "City", name: "الرياض" },
    availableService: ["طب الأسنان", "الجلدية والتجميل", "تقنيات الليزر"].map(name => ({ "@type": "MedicalProcedure", name })),
  };
  if (!meta.branch) return [base, { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: origin, inLanguage: "ar-SA" }];
  return [
    base,
    {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      name: `${SITE_NAME} — ${meta.branch.name}`,
      url: `${origin}${meta.canonicalPath}`,
      image: `${origin}${meta.branch.image}`,
      address: { "@type": "PostalAddress", streetAddress: meta.branch.address, addressLocality: "الرياض", addressCountry: "SA" },
      geo: { "@type": "GeoCoordinates", latitude: meta.branch.lat, longitude: meta.branch.lng },
      medicalSpecialty: ["Dentistry", "Dermatology", "MedicalLaser"],
    },
  ];
}

function snapshot(meta: PageMeta, origin: string) {
  const branches = BRANCHES.map(branch => `<li><a href="/branches/al-${branch.slug}">${escapeHtml(branch.name)} — ${escapeHtml(branch.district)}</a></li>`).join("");
  const services = "<ul><li>طب الأسنان</li><li>الجلدية والتجميل</li><li>تقنيات الليزر</li></ul>";
  const cta = meta.branch ? `<p><a href="/booking?branch=${meta.branch.slug}">احجز موعداً في ${escapeHtml(meta.branch.name)}</a></p>` : "<p><a href=\"/booking\">احجز موعدك الآن</a></p>";
  return `<main dir="rtl" lang="ar" class="seo-snapshot"><article><p>${SITE_NAME}</p><h1>${escapeHtml(meta.heading)}</h1><p>${escapeHtml(meta.summary)}</p>${cta}<h2>تخصصات إيفان الطبية</h2>${services}<h2>فروع إيفان في الرياض</h2><ul>${branches}</ul><p>للحجز: اختر الفرع ثم نوع الرعاية والخدمة والطبيب والموعد المناسب.</p></article></main>`;
}

export function renderSeoPageHtml(rawUrl: string, template: string) {
  const origin = getOrigin();
  const meta = getPageMeta(rawUrl);
  const canonical = `${origin}${meta.canonicalPath}`;
  const image = meta.image && !meta.image.endsWith(".mp4") ? `${origin}${meta.image}` : `${origin}${LOGO_PATH}`;
  const robots = meta.noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />';
  const head = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    robots,
    '<meta property="og:locale" content="ar_SA" />',
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<script type="application/ld+json">${JSON.stringify(pageSchema(meta, origin)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");
  return template.replace("<!--seo-head-->", () => head).replace("<!--seo-html-->", () => snapshot(meta, origin));
}

export function registerSeoRoutes(app: Express) {
  const origin = getOrigin();
  const urls = ["/", "/about", "/vision", "/specialties", "/branches", "/doctors", "/partners", ...BRANCHES.flatMap(branch => [`/branches/al-${branch.slug}`, `/go/${branch.slug}`])];
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin-login\nDisallow: /confirmation/\nSitemap: ${origin}/sitemap.xml\n`);
  });
  app.get("/sitemap.xml", (_req, res) => {
    const rows = urls.map(url => `<url><loc>${origin}${url}</loc><changefreq>${url.startsWith("/go/") ? "monthly" : "weekly"}</changefreq><priority>${url === "/" ? "1.0" : url.startsWith("/branches/") ? "0.9" : "0.7"}</priority></url>`).join("");
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${rows}</urlset>`);
  });
  app.get("/llms.txt", (_req, res) => {
    res.type("text/plain").send(`# ${SITE_NAME}\n\n> ${SITE_DESCRIPTION}\n\n## التخصصات\n- طب الأسنان\n- الجلدية والتجميل\n- تقنيات الليزر\n\n## الفروع في الرياض\n${BRANCHES.map(branch => `- [${branch.name}](${origin}/branches/al-${branch.slug}): ${branch.address}`).join("\n")}\n\n## الحجز\n- [حجز موعد](${origin}/booking)\n`);
  });
}
