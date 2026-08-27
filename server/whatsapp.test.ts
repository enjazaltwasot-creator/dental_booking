import { beforeEach, describe, expect, it, vi } from "vitest";

const { database } = vi.hoisted(() => ({
  database: {
    queueWhatsAppMessageEvent: vi.fn(),
    claimQueuedWhatsAppMessageEvent: vi.fn(),
    updateWhatsAppMessageEvent: vi.fn(),
  },
}));

vi.mock("./db", () => database);

import {
  BOOKING_REQUEST_TEMPLATE_NAME,
  buildBookingRequestReceivedPayload,
  dispatchBookingRequestReceived,
  fingerprintWhatsAppRecipient,
  normalizeWhatsAppRecipient,
  readWhatsAppConfiguration,
} from "./whatsapp";

const booking = {
  id: 42,
  referenceNumber: "DENTAL-BOOK42",
  patientName: "مراجعة اختبار",
  patientPhone: "059 123 4567",
  whatsappBookingConsent: true,
} as Parameters<typeof dispatchBookingRequestReceived>[0];

const configuration = {
  accessToken: "test-token",
  phoneNumberId: "1101566993047104",
  apiVersion: "v18.0",
  templateLanguage: "ar",
};

describe("WhatsApp booking-request confirmation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    database.queueWhatsAppMessageEvent.mockResolvedValue({ id: 9, status: "queued" });
    database.claimQueuedWhatsAppMessageEvent.mockResolvedValue(true);
    database.updateWhatsAppMessageEvent.mockResolvedValue(undefined);
  });

  it("normalizes Saudi local and Arabic-digit numbers to E.164", () => {
    expect(normalizeWhatsAppRecipient("059 123 4567")).toBe("+966591234567");
    expect(normalizeWhatsAppRecipient("٠٥٩١٢٣٤٥٦٧")).toBe("+966591234567");
    expect(normalizeWhatsAppRecipient("123")).toBeNull();
  });

  it("builds the active named-parameter Utility template payload", () => {
    const payload = buildBookingRequestReceivedPayload({
      recipient: "+966591234567",
      patientName: "  مراجعة   اختبار  ",
      bookingReference: "DENTAL-BOOK42",
      language: "ar",
    });

    expect(payload).toMatchObject({
      messaging_product: "whatsapp",
      to: "+966591234567",
      type: "template",
      template: {
        name: BOOKING_REQUEST_TEMPLATE_NAME,
        language: { code: "ar" },
        components: [{
          type: "body",
          parameters: [
            { type: "text", parameter_name: "customer_name", text: "مراجعة اختبار" },
            { type: "text", parameter_name: "booking_reference", text: "DENTAL-BOOK42" },
          ],
        }],
      },
    });
  });

  it("does not create or send any event without explicit booking-message consent", async () => {
    const fetchFn = vi.fn();
    const result = await dispatchBookingRequestReceived({ ...booking, whatsappBookingConsent: false }, { configuration, fetchFn });

    expect(result).toEqual({ status: "skipped" });
    expect(database.queueWhatsAppMessageEvent).not.toHaveBeenCalled();
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("marks the audit event skipped when configuration is missing instead of sending", async () => {
    const fetchFn = vi.fn();
    const result = await dispatchBookingRequestReceived(booking, { configuration: null, fetchFn });

    expect(result).toEqual({ status: "skipped", eventId: 9 });
    expect(database.updateWhatsAppMessageEvent).toHaveBeenCalledWith({
      eventId: 9,
      status: "skipped",
      errorCode: "configuration_missing",
    });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("sends a consented new booking once and stores Meta's returned message id", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ messages: [{ id: "wamid.test-safe-id" }] }),
    });

    const result = await dispatchBookingRequestReceived(booking, { configuration, fetchFn });

    expect(result).toEqual({ status: "accepted", eventId: 9 });
    expect(database.queueWhatsAppMessageEvent).toHaveBeenCalledWith({
      bookingId: 42,
      templateName: BOOKING_REQUEST_TEMPLATE_NAME,
      recipientFingerprint: fingerprintWhatsAppRecipient(booking.patientPhone.trim()),
    });
    expect(fetchFn).toHaveBeenCalledWith(
      "https://graph.facebook.com/v18.0/1101566993047104/messages",
      expect.objectContaining({ method: "POST" })
    );
    expect(database.updateWhatsAppMessageEvent).toHaveBeenLastCalledWith({
      eventId: 9,
      status: "accepted",
      providerMessageId: "wamid.test-safe-id",
      errorCode: null,
    });
  });

  it("recognizes missing required configuration", () => {
    expect(readWhatsAppConfiguration({ WHATSAPP_ACCESS_TOKEN: "only-token" })).toBeNull();
    expect(readWhatsAppConfiguration({
      WHATSAPP_ACCESS_TOKEN: "token",
      WHATSAPP_PHONE_NUMBER_ID: "1101566993047104",
    })).toEqual({ ...configuration, accessToken: "token" });
  });
});
