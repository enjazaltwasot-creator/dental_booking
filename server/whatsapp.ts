import { createHash } from "node:crypto";
import type { Booking } from "../drizzle/schema";
import * as db from "./db";

export const BOOKING_REQUEST_TEMPLATE_NAME = "booking_request_received";

export type WhatsAppConfiguration = {
  accessToken: string;
  phoneNumberId: string;
  apiVersion: string;
  templateLanguage: string;
};

export type WhatsAppDispatchResult = {
  status: "accepted" | "skipped" | "failed" | "already_processed";
  eventId?: number;
};

export function readWhatsAppConfiguration(environment = process.env): WhatsAppConfiguration | null {
  const accessToken = environment.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = environment.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (!accessToken || !phoneNumberId) return null;

  return {
    accessToken,
    phoneNumberId,
    apiVersion: environment.WHATSAPP_API_VERSION?.trim() || "v18.0",
    templateLanguage: environment.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || "ar",
  };
}

export function normalizeWhatsAppRecipient(value: string): string | null {
  const easternArabicDigits = "٠١٢٣٤٥٦٧٨٩";
  let phone = value.trim().replace(/[٠-٩]/g, digit => String(easternArabicDigits.indexOf(digit)));
  phone = phone.replace(/[^\d+]/g, "");
  if (phone.startsWith("00")) phone = `+${phone.slice(2)}`;
  if (phone.startsWith("05")) phone = `+966${phone.slice(1)}`;
  if (phone.startsWith("5") && phone.length === 9) phone = `+966${phone}`;
  if (phone.startsWith("966")) phone = `+${phone}`;
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}

export function fingerprintWhatsAppRecipient(recipient: string): string {
  return createHash("sha256").update(recipient).digest("hex");
}

export function buildBookingRequestReceivedPayload(input: {
  recipient: string;
  patientName: string;
  bookingReference: string;
  language: string;
}) {
  const patientName = input.patientName.trim().replace(/\s+/g, " ").slice(0, 100);
  return {
    messaging_product: "whatsapp" as const,
    recipient_type: "individual" as const,
    to: input.recipient,
    type: "template" as const,
    template: {
      name: BOOKING_REQUEST_TEMPLATE_NAME,
      language: { code: input.language },
      components: [{
        type: "body" as const,
        parameters: [
          { type: "text" as const, parameter_name: "customer_name", text: patientName },
          { type: "text" as const, parameter_name: "booking_reference", text: input.bookingReference },
        ],
      }],
    },
  };
}

function providerErrorCode(response: { status: number }, responseBody: unknown): string {
  const metaCode = typeof responseBody === "object" && responseBody && "error" in responseBody
    && typeof (responseBody as { error?: { code?: unknown } }).error?.code === "number"
    ? (responseBody as { error: { code: number } }).error.code
    : null;
  return metaCode ? `meta_${metaCode}` : `http_${response.status}`;
}

export async function dispatchBookingRequestReceived(
  booking: Booking,
  dependencies: { configuration?: WhatsAppConfiguration | null; fetchFn?: typeof fetch } = {}
): Promise<WhatsAppDispatchResult> {
  if (!booking.whatsappBookingConsent) return { status: "skipped" };

  const rawFingerprint = fingerprintWhatsAppRecipient(booking.patientPhone.trim());
  const event = await db.queueWhatsAppMessageEvent({
    bookingId: booking.id,
    templateName: BOOKING_REQUEST_TEMPLATE_NAME,
    recipientFingerprint: rawFingerprint,
  });
  if (event.status !== "queued") return { status: "already_processed", eventId: event.id };

  const configuration = "configuration" in dependencies
    ? dependencies.configuration
    : readWhatsAppConfiguration();
  if (!configuration) {
    await db.updateWhatsAppMessageEvent({ eventId: event.id, status: "skipped", errorCode: "configuration_missing" });
    return { status: "skipped", eventId: event.id };
  }

  const recipient = normalizeWhatsAppRecipient(booking.patientPhone);
  if (!recipient) {
    await db.updateWhatsAppMessageEvent({ eventId: event.id, status: "failed", errorCode: "invalid_recipient" });
    return { status: "failed", eventId: event.id };
  }

  if (!(await db.claimQueuedWhatsAppMessageEvent(event.id))) return { status: "already_processed", eventId: event.id };

  try {
    const response = await (dependencies.fetchFn ?? fetch)(
      `https://graph.facebook.com/${configuration.apiVersion}/${configuration.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${configuration.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildBookingRequestReceivedPayload({
          recipient,
          patientName: booking.patientName,
          bookingReference: booking.referenceNumber,
          language: configuration.templateLanguage,
        })),
      }
    );
    const responseBody: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      await db.updateWhatsAppMessageEvent({ eventId: event.id, status: "failed", errorCode: providerErrorCode(response, responseBody) });
      return { status: "failed", eventId: event.id };
    }

    const providerMessageId = typeof responseBody === "object" && responseBody && "messages" in responseBody
      ? (responseBody as { messages?: Array<{ id?: unknown }> }).messages?.[0]?.id
      : undefined;
    if (typeof providerMessageId !== "string" || !providerMessageId) {
      await db.updateWhatsAppMessageEvent({ eventId: event.id, status: "failed", errorCode: "response_message_id_missing" });
      return { status: "failed", eventId: event.id };
    }

    await db.updateWhatsAppMessageEvent({ eventId: event.id, status: "accepted", providerMessageId, errorCode: null });
    return { status: "accepted", eventId: event.id };
  } catch {
    await db.updateWhatsAppMessageEvent({ eventId: event.id, status: "failed", errorCode: "request_failed" });
    return { status: "failed", eventId: event.id };
  }
}
