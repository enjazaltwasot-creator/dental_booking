import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const seed = readFileSync(new URL("../hostinger_care_departments_placeholder_seed.sql", import.meta.url), "utf8");

describe("temporary dermatology and laser booking seed", () => {
  it("labels temporary records and links both departments to branches, services, and availability", () => {
    expect(seed).toContain("قيد الاعتماد");
    expect(seed).toContain("'dermatology'");
    expect(seed).toContain("'laser'");
    expect(seed).toContain("INSERT IGNORE INTO `dentist_branches`");
    expect(seed).toContain("INSERT IGNORE INTO `dentist_services`");
    expect(seed).toContain("'10:00:00', '18:00:00'");
  });
});
