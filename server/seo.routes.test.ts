import { describe, expect, it } from "vitest";
import { renderSeoPageHtml } from "./_core/seo";

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
});
