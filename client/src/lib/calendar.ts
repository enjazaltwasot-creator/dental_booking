export type CalendarAppointment = {
  referenceNumber: string;
  appointmentDate: string | Date;
  appointmentTime: string;
  serviceName?: string;
  dentistName?: string;
  branchName?: string;
};

function dateKey(value: string | Date) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value.slice(0, 10);
}

function appointmentParts(dateValue: string | Date, timeValue: string) {
  const [year, month, day] = dateKey(dateValue).split("-").map(Number);
  const [hour, minute] = timeValue.slice(0, 5).split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

function calendarStamp(value: Date) {
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${value.getUTCFullYear()}${pad(value.getUTCMonth() + 1)}${pad(value.getUTCDate())}T${pad(value.getUTCHours())}${pad(value.getUTCMinutes())}${pad(value.getUTCSeconds())}`;
}

function icsEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function buildCalendarEvent(appointment: CalendarAppointment) {
  const start = appointmentParts(appointment.appointmentDate, appointment.appointmentTime);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const date = dateKey(appointment.appointmentDate);
  const title = `طلب موعد — ${appointment.serviceName ?? "خدمة طبية"}`;
  const details = [
    "مجموعة عيادات إيفان الطبية",
    appointment.dentistName ? `الطبيب: ${appointment.dentistName}` : "",
    `الرقم المرجعي: ${appointment.referenceNumber}`,
    "الموعد قيد التأكيد من فريق العيادة.",
  ].filter(Boolean).join("\n");
  const location = appointment.branchName ?? "مجموعة عيادات إيفان الطبية";
  const startStamp = calendarStamp(start);
  const endStamp = calendarStamp(end);
  const dates = `${startStamp}/${endStamp}`;
  const googleUrl = new URL("https://calendar.google.com/calendar/render");
  googleUrl.searchParams.set("action", "TEMPLATE");
  googleUrl.searchParams.set("text", title);
  googleUrl.searchParams.set("dates", dates);
  googleUrl.searchParams.set("ctz", "Asia/Riyadh");
  googleUrl.searchParams.set("details", details);
  googleUrl.searchParams.set("location", location);

  const createdAt = calendarStamp(new Date()) + "Z";
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Evan Medical Group//Appointment//AR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${icsEscape(appointment.referenceNumber)}@evanclinic.sa`,
    `DTSTAMP:${createdAt}`,
    `DTSTART;TZID=Asia/Riyadh:${startStamp}`,
    `DTEND;TZID=Asia/Riyadh:${endStamp}`,
    `SUMMARY:${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(details)}`,
    `LOCATION:${icsEscape(location)}`,
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return {
    googleUrl: googleUrl.toString(),
    icsContent,
    fileName: `evan-appointment-${appointment.referenceNumber}.ics`,
    date,
  };
}

export function downloadCalendarFile(icsContent: string, fileName: string) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
