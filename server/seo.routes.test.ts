import { describe, expect, it } from "vitest";
import { getPageMeta, INDEXABLE_SITEMAP_PATHS, renderSeoPageHtml } from "./_core/seo";

const template = "<html><head><!--seo-head--></head><body><div id=\"root\"><!--seo-html--></div></body></html>";

describe("SEO page renderer", () => {
  it("creates unique Arabic metadata and clinic structured data for a branch", () => {
    const html = renderSeoPageHtml("/branches/al-olaya", template);
    expect(html).toContain("فرع حي العليا في الرياض");
    expect(html).toContain('rel="canonical" href="https://evanclinic.sa/branches/al-olaya"');
    expect(html).toContain("MedicalClinic");
    expect(html).toContain("عماير السيركون");
  });

  it("keeps booking noindex while serving a useful crawlable snapshot", () => {
    const html = renderSeoPageHtml("/booking", template);
    expect(html).toContain('name="robots" content="noindex, follow"');
    expect(html).toContain("اختر الفرع ثم نوع الرعاية");
  });

  it("keeps public page titles and descriptions unique while excluding provisional doctor and ad pages", () => {
    const publicPaths = ["/", "/about", "/vision", "/specialties", "/services", "/branches", "/partners", "/branches/al-mahdiyah", "/branches/al-olaya", "/branches/al-ahmadiyah-laban"];
    const pages = publicPaths.map(getPageMeta);
    expect(new Set(pages.map(page => page.title)).size).toBe(pages.length);
    expect(new Set(pages.map(page => page.description)).size).toBe(pages.length);
    expect(getPageMeta("/doctors").noindex).toBe(true);
    expect(getPageMeta("/go/mahdiyah").noindex).toBe(true);
    expect(renderSeoPageHtml("/", template)).toContain("FAQPage");
  });

  it("renders blog drafts as noindex Article schema until medical approval", () => {
    const html = renderSeoPageHtml("/blog/botox-vs-filler-general-guide", template);
    expect(html).toContain('name="robots" content="noindex, follow"');
    expect(html).toContain("Article");
    expect(html).toContain("البوتوكس والفيلر");
  });

  it("keeps noindex ad, booking, doctor, and draft-blog pages out of the sitemap", () => {
    expect(INDEXABLE_SITEMAP_PATHS).toContain("/branches/al-mahdiyah");
    expect(INDEXABLE_SITEMAP_PATHS).not.toContain("/go/mahdiyah");
    expect(INDEXABLE_SITEMAP_PATHS).not.toContain("/booking");
    expect(INDEXABLE_SITEMAP_PATHS).not.toContain("/doctors");
    expect(INDEXABLE_SITEMAP_PATHS).not.toContain("/blog");
  });
});
