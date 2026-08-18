import type { ReactNode } from "react";
import { Link, useParams } from "wouter";
import { CalendarDays, CheckCircle2, Clock, Copy, Loader2, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";
import PageShell from "@/components/PageShell";
import { trpc } from "@/lib/trpc";
import { STATUS_META, formatDate, getBranchBySlug } from "@/lib/clinic";

export default function BookingConfirmation() {
  const params = useParams<{ reference: string }>();
  const reference = params.reference ?? "";

  const { data: booking, isLoading } = trpc.bookings.getByReferenceNumber.useQuery(
    { referenceNumber: reference },
    { enabled: Boolean(reference) }
  );

  const { data: services } = trpc.services.list.useQuery();
  const { data: dentists } = trpc.dentists.list.useQuery();

  const service = services?.find(s => s.id === booking?.serviceId);
  const dentist = dentists?.find(d => d.id === booking?.dentistId);
  const branch = getBranchBySlug(booking?.branch ?? undefined);
  const status = booking ? STATUS_META[booking.status as keyof typeof STATUS_META] : null;

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      toast.success("تم نسخ الرقم المرجعي");
    } catch {
      toast.error("تعذر النسخ");
    }
  };

  return (
    <PageShell>
      <section className="py-14">
        <div className="container max-w-2xl">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              جاري تحميل تفاصيل الحجز...
            </div>
          )}

          {!isLoading && !booking && (
            <div className="rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
              <h1 className="text-xl font-bold text-foreground">لم يتم العثور على الحجز</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                تأكد من صحة الرقم المرجعي أو قم بإنشاء حجز جديد.
              </p>
              <Link
                href="/booking"
                className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
              >
                حجز موعد جديد
              </Link>
            </div>
          )}

          {booking && (
            <div className="rise-in overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="relative overflow-hidden border-b border-border bg-emerald-50/60 px-6 py-10 text-center sm:px-10">
                <span className="confirmation-spark confirmation-spark-one" aria-hidden="true">✦</span>
                <span className="confirmation-spark confirmation-spark-two" aria-hidden="true">✦</span>
                <span className="confirmation-check relative z-10 mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="size-8" />
                </span>
                <h1 className="confirmation-title relative z-10 mt-5 text-2xl font-extrabold text-foreground">تم استلام حجزك بنجاح</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  حفظنا تفاصيل موعدك، وسيتواصل معك فريق العيادة لتأكيده.
                </p>
              </div>

              <div className="px-6 py-8 sm:px-10">
                <div className="confirmation-summary-grid mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <SummaryCell label="الفرع" value={branch?.name ?? "قيد التحديد"} />
                  <SummaryCell label="الخدمة" value={service?.name ?? "قيد التحديد"} />
                  <SummaryCell label="الطبيب" value={dentist?.name ?? "قيد التحديد"} />
                  <SummaryCell label="الموعد" value={`${formatDate(booking.appointmentDate)} · ${String(booking.appointmentTime).slice(0, 5)}`} />
                </div>

                <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5 text-center">
                  <span className="text-xs font-semibold text-muted-foreground">الرقم المرجعي</span>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <span dir="ltr" className="text-xl font-extrabold tracking-wider text-primary">
                      {booking.referenceNumber}
                    </span>
                    <button
                      type="button"
                      onClick={copyReference}
                      aria-label="نسخ الرقم المرجعي"
                      className="grid size-8 place-items-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Copy className="size-4" />
                    </button>
                  </div>
                </div>

                <dl className="mt-7 space-y-4 text-sm">
                  <Row icon={<User className="size-4 text-primary" />} label="المريض" value={booking.patientName} />
                  <Row icon={<Phone className="size-4 text-primary" />} label="رقم الجوال" value={booking.patientPhone} ltr />
                  <Row icon={<CalendarDays className="size-4 text-primary" />} label="التاريخ" value={formatDate(booking.appointmentDate)} />
                  <Row icon={<Clock className="size-4 text-primary" />} label="الوقت" value={String(booking.appointmentTime).slice(0, 5)} ltr />
                  {branch && <Row icon={<MapPin className="size-4 text-primary" />} label="الفرع" value={branch.name} />}
                  {service && <Row label="الخدمة" value={service.name} />}
                  {dentist && <Row label="الطبيب" value={`${dentist.name} — ${dentist.specialization}`} />}
                  {booking.notes && <Row label="ملاحظات" value={booking.notes} />}

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <dt className="font-semibold text-muted-foreground">الحالة</dt>
                    <dd>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${status?.className ?? ""}`}>
                        {status?.label}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="flex-1 rounded-xl border border-border bg-white py-3 text-center text-sm font-bold text-foreground transition-all duration-200 hover:shadow-sm"
                  >
                    العودة للرئيسية
                  </Link>
                  <Link
                    href="/booking"
                    className="flex-1 rounded-xl bg-primary py-3 text-center text-sm font-bold text-primary-foreground transition-all duration-200 hover:shadow-md"
                  >
                    حجز موعد آخر
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="confirmation-summary-cell rounded-xl border border-border bg-white p-3 text-right shadow-sm">
      <span className="block text-[11px] font-bold text-muted-foreground">{label}</span>
      <span className="mt-1 block line-clamp-2 text-xs font-extrabold leading-5 text-foreground">{value}</span>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  ltr,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
      <dt className="flex items-center gap-2 font-semibold text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd dir={ltr ? "ltr" : undefined} className="text-left font-bold text-foreground">
        {value}
      </dd>
    </div>
  );
}
