import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Building2, Check, Loader2, MapPin, Sparkles, Stethoscope, Timer, Zap } from "lucide-react";
import PageShell from "@/components/PageShell";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { toDateInputValue } from "@/lib/clinic";

const STEPS = ["الفرع", "النوع", "الخدمة", "الطبيب", "الموعد", "بياناتك"] as const;
const SERVICE_TYPES = [
  { id: "dentistry", label: "خدمات الأسنان", description: "العلاجات والابتسامة وصحة الفم", icon: Stethoscope },
  { id: "dermatology", label: "الجلدية والتجميل", description: "العناية بالبشرة وخدمات التجميل", icon: Sparkles },
  { id: "laser", label: "خدمات الليزر", description: "جلسات الليزر المتاحة في الفرع", icon: Zap },
] as const;
type ServiceDepartment = (typeof SERVICE_TYPES)[number]["id"];

export default function BookingForm() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);

  const [branchSlug, setBranchSlug] = useState<string | null>(() => new URLSearchParams(window.location.search).get("branch"));
  const [department, setDepartment] = useState<ServiceDepartment | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [dentistId, setDentistId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [notes, setNotes] = useState("");

  const minDate = useMemo(() => toDateInputValue(new Date()), []);
  const { data: branches, isLoading: loadingBranches } = trpc.branches.list.useQuery();
  const selectedBranch = (branches ?? []).find(branch => branch.slug === branchSlug);
  const { data: services, isLoading: loadingServices } = trpc.services.listForBranch.useQuery({ branch: branchSlug ?? "unselected" }, { enabled: Boolean(branchSlug) });
  const { data: dentists, isLoading: loadingDentists } = trpc.dentists.list.useQuery();
  const availableDepartments = useMemo(
    () => new Set((services ?? []).map(service => service.department as ServiceDepartment)),
    [services]
  );
  const filteredServices = useMemo(
    () => (services ?? []).filter(service => service.department === department),
    [services, department]
  );

  const { data: slots, isFetching: loadingSlots } = trpc.workingHours.availableSlots.useQuery(
    { dentistId: dentistId ?? 0, date },
    { enabled: Boolean(dentistId) && Boolean(date) }
  );

  useEffect(() => {
    setTime("");
  }, [dentistId, date]);

  useEffect(() => {
    setDepartment(null);
    setServiceId(null);
    setDentistId(null);
    setDate("");
    setTime("");
  }, [branchSlug]);

  useEffect(() => {
    if (branchSlug && branches && !selectedBranch) setBranchSlug(null);
  }, [branchSlug, branches, selectedBranch]);
  useEffect(() => {
    if (serviceId && !filteredServices.some(service => service.id === serviceId)) setServiceId(null);
  }, [serviceId, filteredServices]);

  const createBooking = trpc.bookings.create.useMutation({
    onSuccess: booking => {
      navigate(`/confirmation/${booking.referenceNumber}`);
    },
    onError: error => {
      toast.error(error.message || "تعذر إتمام الحجز، يرجى المحاولة مرة أخرى.");
    },
  });

  const canContinue = [
    Boolean(branchSlug),
    Boolean(department),
    Boolean(serviceId),
    Boolean(dentistId),
    Boolean(date) && Boolean(time),
    patientName.trim().length >= 3 && patientPhone.trim().length >= 9,
  ][step];

  const handleSubmit = () => {
    if (!branchSlug || !serviceId || !dentistId || !date || !time) return;
    createBooking.mutate({
      branch: branchSlug,
      serviceId,
      dentistId,
      appointmentDate: date,
      appointmentTime: time,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <PageShell>
      <section className="border-b border-border bg-secondary/30 py-12">
        <div className="container text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">احجز موعدك</h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-8 text-muted-foreground">
            ابدأ باختيار الفرع، ثم أكمل خطوات الحجز حتى تأكيد موعدك.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-3xl">
          {/* Stepper */}
          <ol className="flex items-center gap-2">
            {STEPS.map((label, index) => {
              const done = index < step;
              const active = index === step;
              return (
                <li key={label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-center gap-2">
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors duration-200",
                        done && "bg-primary text-primary-foreground",
                        active && "bg-accent text-accent-foreground",
                        !done && !active && "bg-secondary text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="size-4" /> : index + 1}
                    </span>
                    {index < STEPS.length - 1 && (
                      <span
                        className={cn(
                          "h-0.5 flex-1 rounded-full transition-colors duration-200",
                          done ? "bg-primary" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      "w-full text-center text-[11px] font-semibold sm:text-xs",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            {selectedBranch && step > 0 && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3">
                <span className="grid size-9 place-items-center rounded-lg bg-white text-primary shadow-sm"><Building2 className="size-4" /></span>
                <div>
                  <p className="text-xs font-bold text-primary">الفرع المختار</p>
                  <p className="mt-0.5 text-sm font-extrabold text-foreground">{selectedBranch.name}</p>
                </div>
              </div>
            )}

            {department && step > 1 && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                <span className="grid size-9 place-items-center rounded-lg bg-white text-accent shadow-sm">
                  {(() => {
                    const Icon = SERVICE_TYPES.find(type => type.id === department)?.icon ?? Sparkles;
                    return <Icon className="size-4" />;
                  })()}
                </span>
                <div>
                  <p className="text-xs font-bold text-accent">نوع الخدمة</p>
                  <p className="mt-0.5 text-sm font-extrabold text-foreground">{SERVICE_TYPES.find(type => type.id === department)?.label}</p>
                </div>
              </div>
            )}

            {/* Step 1 — Branch */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground">اختر الفرع</h2>
                <p className="mt-1 text-sm text-muted-foreground">ابدأ من الفرع الأقرب إليك، وسيتم حفظه مع طلب الحجز.</p>
                <div className="mt-6 grid gap-3">
                  {loadingBranches && <p className="rounded-xl bg-secondary/50 p-4 text-center text-sm text-muted-foreground">جاري تحميل الفروع...</p>}
                  {!loadingBranches && !(branches?.length) && <p className="rounded-xl bg-secondary/50 p-4 text-center text-sm text-muted-foreground">لا توجد فروع متاحة للحجز حالياً.</p>}
                  {(branches ?? []).map(branch => (
                    <button
                      key={branch.slug}
                      type="button"
                      onClick={() => setBranchSlug(branch.slug)}
                      className={cn(
                        "flex items-center justify-between gap-4 rounded-xl border p-4 text-right transition-all duration-200",
                        branchSlug === branch.slug
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="size-5" /></span>
                        <span><span className="block font-bold text-foreground">{branch.name}</span><span className="mt-0.5 block text-sm text-muted-foreground">{branch.city}</span></span>
                      </span>
                      <span className="text-xs font-bold text-primary">اختيار</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Service type */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-foreground">اختر نوع الخدمة</h2>
                <p className="mt-1 text-sm text-muted-foreground">ستظهر لك الأنواع المتاحة في فرع {selectedBranch?.name ?? "المختار"} فقط.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {loadingServices && [0, 1, 2].map(item => <div key={item} className="h-36 animate-pulse rounded-xl bg-secondary/60" />)}
                  {!loadingServices && SERVICE_TYPES.filter(type => availableDepartments.has(type.id)).map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setDepartment(type.id)}
                        className={cn(
                          "group rounded-xl border p-5 text-right transition-all duration-200",
                          department === type.id ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-white hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                        )}
                      >
                        <span className={cn("grid size-11 place-items-center rounded-xl transition-colors", department === type.id ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground")}><Icon className="size-5" /></span>
                        <span className="mt-4 block font-bold text-foreground">{type.label}</span>
                        <span className="mt-1 block text-xs leading-6 text-muted-foreground">{type.description}</span>
                      </button>
                    );
                  })}
                </div>
                {!loadingServices && availableDepartments.size === 0 && <p className="mt-6 rounded-xl bg-secondary/50 p-4 text-center text-sm text-muted-foreground">لا توجد أنواع خدمات متاحة في هذا الفرع حالياً.</p>}
              </div>
            )}

            {/* Step 3 — Service */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-foreground">اختر الخدمة</h2>
                <p className="mt-1 text-sm text-muted-foreground">حدّد الخدمة المناسبة ضمن نوع الخدمة الذي اخترته.</p>

                {loadingServices && (
                  <div className="mt-6 space-y-3">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/60" />
                    ))}
                  </div>
                )}

                {!loadingServices && filteredServices.length === 0 && (
                  <p className="mt-6 rounded-xl bg-secondary/50 p-4 text-center text-sm text-muted-foreground">
                    لا توجد خدمات متاحة حالياً.
                  </p>
                )}

                <div className="mt-6 grid gap-3">
                  {filteredServices.map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setServiceId(service.id)}
                      className={cn(
                        "flex items-center justify-between gap-4 rounded-xl border p-4 text-right transition-all duration-200",
                        serviceId === service.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block font-bold text-foreground">{service.name}</span>
                        <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                          {service.description}
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                        <Timer className="size-3.5" />
                        {service.duration} د
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 — Doctor */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-foreground">اختر الطبيب</h2>
                <p className="mt-1 text-sm text-muted-foreground">اختر الطبيب المناسب من القائمة المتاحة حالياً؛ الفرع المختار سيُحفظ مع طلبك.</p>

                {loadingDentists && (
                  <div className="mt-6 space-y-3">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/60" />
                    ))}
                  </div>
                )}

                <div className="mt-6 grid gap-3">
                  {(dentists ?? []).map(doctor => (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => setDentistId(doctor.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-4 text-right transition-all duration-200",
                        dentistId === doctor.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
                      )}
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 font-extrabold text-primary">
                        {doctor.name.replace("د.", "").trim().charAt(0)}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold text-foreground">{doctor.name}</span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {doctor.specialization}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 — Date & time */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-foreground">اختر التاريخ والوقت</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  المواعيد المعروضة متاحة فعلياً لدى الطبيب المختار.
                </p>

                <div className="mt-6">
                  <label htmlFor="date" className="block text-sm font-semibold text-foreground">
                    التاريخ
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    min={minDate}
                    onChange={e => setDate(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </div>

                {date && (
                  <div className="mt-6">
                    <span className="block text-sm font-semibold text-foreground">الأوقات المتاحة</span>

                    {loadingSlots && (
                      <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        جاري تحميل المواعيد...
                      </p>
                    )}

                    {!loadingSlots && (slots?.length ?? 0) === 0 && (
                      <p className="mt-3 rounded-xl bg-secondary/50 p-4 text-center text-sm text-muted-foreground">
                        لا توجد مواعيد متاحة في هذا اليوم، جرّب تاريخاً آخر.
                      </p>
                    )}

                    {!loadingSlots && (slots?.length ?? 0) > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {(slots ?? []).map(slot => (
                          <button
                            key={slot}
                            type="button"
                            dir="ltr"
                            onClick={() => setTime(slot)}
                            className={cn(
                              "rounded-lg border py-2.5 text-sm font-bold transition-all duration-200",
                              time === slot
                                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                : "border-border bg-white text-foreground hover:border-primary/40"
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 6 — Patient details */}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-bold text-foreground">بياناتك</h2>
                <p className="mt-1 text-sm text-muted-foreground">سنستخدم هذه البيانات لتأكيد موعدك.</p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                      الاسم الكامل
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
                      رقم الجوال
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      dir="ltr"
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-right text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-foreground">
                      ملاحظات (اختياري)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="أي تفاصيل تودّ إخبار الطبيب بها"
                      className="mt-2 w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition-all duration-200 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight className="size-4" />
                السابق
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                  disabled={!canContinue}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                >
                  التالي
                  <ArrowLeft className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canContinue || createBooking.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {createBooking.isPending && <Loader2 className="size-4 animate-spin" />}
                  تأكيد الحجز
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
