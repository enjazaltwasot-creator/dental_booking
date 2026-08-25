import type { Express } from "express";
import { getBlogPost } from "../../shared/blog";

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
  { slug: "mahdiyah", name: "فرع حي المهدية", district: "غرب الرياض", address: "حي المهدية، غرب الرياض", lat: 24.6553724, lng: 46.5126144, image: "/assets/evan-mahdiyah-building-enhanced_dec82603.webp" },
  { slug: "olaya", name: "فرع حي العليا", district: "وسط الرياض", address: "عماير السيركون، شارع موسى بن نصير، العليا، الرياض", lat: 24.7046584, lng: 46.6840428, image: "/assets/evan-olaya-building-night-enhanced_2f58024a.webp" },
  { slug: "ahmadiyah-laban", name: "فرع حي الأحمدية — لبن", district: "الأحمدية، لبن", address: "حي الأحمدية، لبن، غرب الرياض", lat: 24.6310446, lng: 46.6094759, image: "/assets/evan-ahmadiyah-building-enhanced_1a2b3264.webp" },
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

export function getPageMeta(rawUrl: string): PageMeta {
  const path = normalizePath(rawUrl);
  if (path === "/blog") {
    return { title: `المدونة الطبية | ${SITE_NAME}`, description: "مسودات توعوية عامة في طب الأسنان والجلدية والليزر بانتظار اعتماد المراجعة الطبية.", canonicalPath: "/blog", noindex: true, heading: "المدونة الطبية", summary: "محتوى توعوي عام لا يغني عن استشارة المختص." };
  }
  const blogPost = getBlogPost(path.match(/^\/blog\/([^/]+)$/)?.[1]);
  if (blogPost) {
    return { title: `${blogPost.title} | ${SITE_NAME}`, description: blogPost.description, canonicalPath: path, noindex: true, heading: blogPost.title, summary: blogPost.excerpt };
  }
  const branchSlug = path.match(/^\/(?:branches\/al-|go\/)(mahdiyah|olaya|ahmadiyah-laban)$/)?.[1];
  const branch = BRANCHES.find(item => item.slug === branchSlug);
  if (branch) {
    return {
      title: `${branch.name} في الرياض | ${SITE_NAME}`,
      description: `${branch.name} في ${branch.district} بالرياض. تعرّف على خدمات طب الأسنان والجلدية والليزر، ثم اختر الخدمة والطبيب والموعد المناسب أو افتح الاتجاهات إلى الفرع.`,
      canonicalPath: `/branches/al-${branch.slug}`,
      image: branch.image,
      noindex: path.startsWith("/go/"),
      branch,
      heading: branch.name,
      summary: `خدمات الأسنان والجلدية والليزر في ${branch.address}. اختر الخدمة والطبيب والموعد المناسب عبر الحجز الإلكتروني.`,
    };
  }

  const pages: Record<string, PageMeta> = {
    "/": { title: `${SITE_NAME} | أسنان وجلدية وليزر في الرياض`, description: SITE_DESCRIPTION, canonicalPath: "/", image: "/assets/evan-natural-hero-day-extended_5ec37a01.mp4", heading: SITE_NAME, summary: "خدمات الأسنان والجلدية والليزر ضمن تجربة حجز موحدة في فروع الرياض." },
    "/about": { title: `عن ${SITE_NAME} في الرياض`, description: "تعرّف على مجموعة عيادات إيفان الطبية وفروعها في المهدية والعليا والأحمدية لبن، وعلى مسار حجز واضح لخدمات الأسنان والجلدية والليزر في الرياض.", canonicalPath: "/about", heading: "عن مجموعة عيادات إيفان الطبية", summary: "منظومة طبية تجمع طب الأسنان والجلدية والليزر ضمن تجربة واضحة للمراجع." },
    "/vision": { title: `رؤية ${SITE_NAME} للرعاية المتكاملة`, description: "تعرّف على رؤية إيفان لتجربة رعاية أوضح وأقرب إلى المراجع، من اختيار الفرع والتخصص إلى تحديد الطبيب والموعد المناسب في الرياض.", canonicalPath: "/vision", heading: "رؤيتنا", summary: "رعاية طبية أوضح وأقرب عبر تخصصات محددة وفروع سهلة الوصول وحجز منظم." },
    "/specialties": { title: `تخصصات إيفان الطبية في الرياض`, description: "استكشف تخصصات طب الأسنان والجلدية والتجميل وتقنيات الليزر لدى مجموعة عيادات إيفان الطبية، ثم انتقل إلى الحجز باختيار الفرع والخدمة والموعد.", canonicalPath: "/specialties", heading: "تخصصاتنا", summary: "طب الأسنان والجلدية والتجميل وتقنيات الليزر ضمن منظومة رعاية واحدة." },
    "/services": { title: `خدمات إيفان الطبية في الرياض`, description: "استعرض مسارات حجز خدمات الأسنان والجلدية والليزر في فروع إيفان بالرياض، واختر الفرع ونوع الرعاية والخدمة والطبيب والوقت وفق التوافر.", canonicalPath: "/specialties", heading: "خدمات إيفان الطبية", summary: "اختر التخصص والخدمة والفرع والطبيب والموعد ضمن رحلة حجز رقمية واضحة." },
    "/branches": { title: `فروع إيفان الطبية في الرياض`, description: "دليل فروع مجموعة عيادات إيفان الطبية في حي المهدية وحي العليا وحي الأحمدية لبن بالرياض، مع الموقع وخيار متابعة الحجز للفرع المناسب.", canonicalPath: "/branches", heading: "فروعنا في الرياض", summary: "ثلاثة فروع في الرياض لتختار الموقع الأقرب لك وتبدأ الحجز الإلكتروني." },
    "/doctors": { title: `الفريق الطبي في إيفان | ملفات قيد الاعتماد`, description: "تُستكمل الملفات المهنية للطواقم الطبية في مجموعة إيفان بعد اعتماد البيانات الرسمية. يمكنك متابعة الحجز باختيار الخدمة والفرع والموعد المتاح.", canonicalPath: "/doctors", noindex: true, heading: "فريقنا الطبي", summary: "تُعرض ملفات الأطباء بعد اعتماد البيانات المهنية الرسمية من إدارة المجموعة." },
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
  if (!meta.branch) {
    const schemas: Array<Record<string, unknown>> = [base, { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: origin, inLanguage: "ar-SA" }];
    if (meta.canonicalPath === "/") {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "كيف أحجز موعداً؟", acceptedAnswer: { "@type": "Answer", text: "ابدأ باختيار الفرع، ثم نوع الرعاية والخدمة والطبيب والموعد المتاح، وأدخل بيانات التواصل لإرسال طلب الحجز." } },
          { "@type": "Question", name: "كيف أختار الفرع الأنسب؟", acceptedAnswer: { "@type": "Answer", text: "استعرض فروع المهدية والعليا والأحمدية لبن، واختر الموقع الذي يناسبك قبل متابعة الحجز." } },
          { "@type": "Question", name: "هل يمكنني اختيار الطبيب؟", acceptedAnswer: { "@type": "Answer", text: "نعم، بعد اختيار الفرع والخدمة يمكنك اختيار طبيب محدد أو الاستفادة من اقتراح أقرب طبيب متاح." } },
        ],
      });
    }
    const blogPost = getBlogPost(meta.canonicalPath.match(/^\/blog\/([^/]+)$/)?.[1]);
    if (blogPost) schemas.push({ "@context": "https://schema.org", "@type": "Article", headline: blogPost.title, description: blogPost.description, inLanguage: "ar-SA", mainEntityOfPage: `${origin}${meta.canonicalPath}`, isAccessibleForFree: true });
    return schemas;
  }
  return [
    base,
    {
      "@context": "https://schema.org",
      "@type": ["MedicalClinic", "LocalBusiness"],
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
    const privatePaths = "Disallow: /admin\nDisallow: /admin-login\nDisallow: /confirmation/";
    const aiAgents = ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended"];
    const directives = ["User-agent: *\nAllow: /\n" + privatePaths, ...aiAgents.map(agent => `User-agent: ${agent}\nAllow: /\n${privatePaths}`)];
    res.type("text/plain").send(`${directives.join("\n\n")}\n\nSitemap: ${origin}/sitemap.xml\n`);
  });
  app.get("/sitemap.xml", (_req, res) => {
    const rows = urls.map(url => `<url><loc>${origin}${url}</loc><changefreq>${url.startsWith("/go/") ? "monthly" : "weekly"}</changefreq><priority>${url === "/" ? "1.0" : url.startsWith("/branches/") ? "0.9" : "0.7"}</priority></url>`).join("");
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${rows}</urlset>`);
  });
  app.get("/llms.txt", (_req, res) => {
    res.type("text/plain").send(`# ${SITE_NAME}\n\n> ${SITE_DESCRIPTION}\n\n## التخصصات\n- طب الأسنان\n- الجلدية والتجميل\n- تقنيات الليزر\n\n## الفروع في الرياض\n${BRANCHES.map(branch => `- [${branch.name}](${origin}/branches/al-${branch.slug}): ${branch.address}`).join("\n")}\n\n## الحجز\n- [حجز موعد](${origin}/booking)\n`);
  });
}
