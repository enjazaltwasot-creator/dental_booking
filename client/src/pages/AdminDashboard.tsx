import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  BellRing,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  Layers3,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { BRANCHES, LOGO_SRC, SPECIALTIES, STATUS_META, formatDate, getBranchBySlug } from "@/lib/clinic";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "معلق" },
  { value: "confirmed", label: "مؤكد" },
  { value: "cancelled", label: "ملغى" },
];

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [newBookingCount, setNewBookingCount] = useState(0);
  const knownBookingIds = useRef<Set<number> | null>(null);

  const utils = trpc.useUtils();
  const { data: auth, isLoading: checkingAuth } = trpc.admin.checkAuth.useQuery();
  const authed = auth?.isAuthenticated ?? false;

  useEffect(() => {
    if (!checkingAuth && !authed) navigate("/admin-login");
  }, [checkingAuth, authed, navigate]);

  const {
    data: bookings,
    isLoading: loadingBookings,
    isFetching,
    refetch,
  } = trpc.bookings.getAll.useQuery(undefined, {
    enabled: authed,
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
  });

  const { data: services } = trpc.services.list.useQuery(undefined, { enabled: authed });
  const { data: dentists } = trpc.dentists.list.useQuery(undefined, { enabled: authed });

  const updateStatus = trpc.bookings.updateStatus.useMutation({
    onSuccess: () => {
      utils.bookings.getAll.invalidate();
      toast.success("تم تحديث حالة الحجز");
    },
    onError: () => toast.error("تعذر تحديث الحالة"),
  });

  const logout = trpc.admin.logout.useMutation({
    onSuccess: async () => {
      await utils.admin.checkAuth.invalidate();
      navigate("/admin-login");
    },
  });

  useEffect(() => {
    if (!bookings) return;
    const currentIds = new Set(bookings.map(booking => booking.id));
    if (!knownBookingIds.current) {
      knownBookingIds.current = currentIds;
      return;
    }

    const arrived = bookings.filter(booking => !knownBookingIds.current?.has(booking.id));
    knownBookingIds.current = currentIds;
    if (arrived.length === 0) return;

    setNewBookingCount(current => current + arrived.length);
    toast.success(
      arrived.length === 1
        ? `وصل طلب حجز جديد باسم ${arrived[0].patientName}`
        : `وصلت ${arrived.length} طلبات حجز جديدة`
    );
  }, [bookings]);

  const stats = useMemo(() => {
    const list = bookings ?? [];
    return {
      total: list.length,
      pending: list.filter(b => b.status === "pending").length,
      confirmed: list.filter(b => b.status === "confirmed").length,
      cancelled: list.filter(b => b.status === "cancelled").length,
    };
  }, [bookings]);

  const filtered = useMemo(() => {
    const term = search.trim();
    return (bookings ?? []).filter(b => {
      const branch = getBranchBySlug(b.branch ?? undefined);
      const matchesStatus = filter === "all" || b.status === filter;
      const matchesSearch =
        !term ||
        b.patientName.includes(term) ||
        b.patientPhone.includes(term) ||
        branch?.name.includes(term) ||
        b.referenceNumber.toLowerCase().includes(term.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, filter, search]);

  if (checkingAuth || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={LOGO_SRC} alt="مجموعة عيادات إيفان الطبية" className="h-10 w-auto" />
            <span className="hidden text-sm font-bold text-muted-foreground sm:block">
              لوحة إدارة الحجوزات والمحتوى
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNewBookingCount(0)}
              aria-label="عرض تنبيهات الحجوزات"
              className="relative grid size-10 place-items-center rounded-xl border border-border bg-white text-primary transition-all duration-200 hover:shadow-sm"
            >
              <BellRing className="size-4" />
              {newBookingCount > 0 && (
                <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold leading-5 text-accent-foreground">
                  {newBookingCount > 9 ? "9+" : newBookingCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => logout.mutate()}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-foreground transition-all duration-200 hover:shadow-sm"
            >
              <LogOut className="size-4" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="إجمالي الحجوزات" value={stats.total} tone="text-primary" />
          <StatCard label="معلقة" value={stats.pending} tone="text-amber-600" />
          <StatCard label="مؤكدة" value={stats.confirmed} tone="text-emerald-600" />
          <StatCard label="ملغاة" value={stats.cancelled} tone="text-rose-600" />
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"><Layers3 className="size-4" /> التخصصات المعلنة</span>
                <h2 className="mt-2 text-xl font-extrabold text-foreground">محتوى صفحة التخصصات</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">بطاقات مرجعية للتخصصات والصور المستخدمة في واجهة الموقع.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{SPECIALTIES.length} تخصصات</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {SPECIALTIES.map(specialty => (
                <article key={specialty.id} className="overflow-hidden rounded-xl border border-border bg-secondary/20">
                  <img src={specialty.image} alt="" className="h-24 w-full object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-extrabold text-primary">{specialty.number}</p>
                    <h3 className="mt-1 text-sm font-extrabold text-foreground">{specialty.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{specialty.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-accent"><BookOpenCheck className="size-4" /> خدمات الحجز</span>
                <h2 className="mt-2 text-xl font-extrabold text-foreground">خيارات قسم الأسنان</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">هذه الخدمات تظهر للمراجع داخل خطوة اختيار الخدمة.</p>
              </div>
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-extrabold text-accent">{services?.length ?? 0} خدمات</span>
            </div>

            <div className="mt-4 divide-y divide-border rounded-xl border border-border">
              {(services ?? []).map(service => (
                <div key={service.id} className="flex items-center justify-between gap-3 px-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{service.name}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{service.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-700 ring-1 ring-emerald-200">ظاهر للحجز</span>
                </div>
              ))}
              {!services?.length && <p className="px-3 py-6 text-center text-sm text-muted-foreground">جاري تحميل الخدمات...</p>}
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الجوال أو الرقم المرجعي"
              className="w-full rounded-xl border border-border bg-white py-2.5 pe-10 ps-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map(item => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-xs font-bold transition-colors duration-200",
                  filter === item.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                )}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => refetch()}
              aria-label="تحديث"
              className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-primary"
            >
              <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {loadingBookings && (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              جاري تحميل الحجوزات...
            </div>
          )}

          {!loadingBookings && filtered.length === 0 && (
            <div className="py-16 text-center">
              <CalendarClock className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">لا توجد حجوزات مطابقة.</p>
            </div>
          )}

          {!loadingBookings && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-right">
                    <Th>الرقم المرجعي</Th>
                    <Th>المريض</Th>
                    <Th>الجوال</Th>
                    <Th>الفرع</Th>
                    <Th>الموعد</Th>
                    <Th>الخدمة</Th>
                    <Th>الطبيب</Th>
                    <Th>الحالة</Th>
                    <Th>إجراءات</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(booking => {
                    const meta = STATUS_META[booking.status as keyof typeof STATUS_META];
                    const service = services?.find(s => s.id === booking.serviceId);
                    const dentist = dentists?.find(d => d.id === booking.dentistId);
                    const branch = getBranchBySlug(booking.branch ?? undefined);
                    const busy = updateStatus.isPending;

                    return (
                      <tr
                        key={booking.id}
                        className="border-b border-border transition-colors duration-200 last:border-0 hover:bg-secondary/30"
                      >
                        <Td>
                          <span dir="ltr" className="font-mono text-xs font-bold text-primary">
                            {booking.referenceNumber}
                          </span>
                        </Td>
                        <Td><span className="font-semibold text-foreground">{booking.patientName}</span></Td>
                        <Td><span dir="ltr" className="block text-right">{booking.patientPhone}</span></Td>
                        <Td><span className="font-semibold text-foreground">{branch?.shortName ?? "غير محدد"}</span></Td>
                        <Td>
                          <span className="block text-foreground">{formatDate(booking.appointmentDate)}</span>
                          <span dir="ltr" className="block text-xs text-muted-foreground">
                            {String(booking.appointmentTime).slice(0, 5)}
                          </span>
                        </Td>
                        <Td>{service?.name ?? "-"}</Td>
                        <Td>{dentist?.name ?? "-"}</Td>
                        <Td>
                          <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", meta?.className)}>
                            {meta?.label}
                          </span>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-1.5">
                            {booking.status !== "confirmed" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  updateStatus.mutate({
                                    referenceNumber: booking.referenceNumber,
                                    status: "confirmed",
                                  })
                                }
                                aria-label="تأكيد"
                                className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 transition-all duration-200 hover:shadow-sm disabled:opacity-50"
                              >
                                <CheckCircle2 className="size-4" />
                              </button>
                            )}
                            {booking.status !== "cancelled" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  updateStatus.mutate({
                                    referenceNumber: booking.referenceNumber,
                                    status: "cancelled",
                                  })
                                }
                                aria-label="إلغاء"
                                className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-200 transition-all duration-200 hover:shadow-sm disabled:opacity-50"
                              >
                                <XCircle className="size-4" />
                              </button>
                            )}
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-3xl font-extrabold", tone)}>{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3.5 text-xs font-bold text-muted-foreground">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">{children}</td>;
}
