import { describe, expect, it } from "vitest";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

describe("بيانات اعتماد WhatsApp Business", () => {
  it("تتحقق من رمز الوصول عبر مورد رقم الهاتف دون إرسال أي رسالة", async () => {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    expect(accessToken, "يجب توفير رمز الوصول عبر الإعدادات السرية").toBeTruthy();
    expect(PHONE_NUMBER_ID, "يجب توفير معرّف رقم WhatsApp عبر الإعدادات السرية").toBeTruthy();

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}?fields=id,code_verification_status,quality_rating`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const payload = (await response.json()) as { id?: string; error?: { message?: string } };

    expect(response.ok, payload.error?.message ?? "تعذر التحقق من رمز WhatsApp").toBe(true);
    expect(payload.id).toBe(PHONE_NUMBER_ID);
  }, 15_000);
});
