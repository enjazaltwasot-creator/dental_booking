import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  BellRing,
  BookOpenCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  Download,
  Layers3,
  Loader2,
  LogOut,
  MessageSquareText,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Search,
  Trash2,
  UserCog,
  UserPlus,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { LOGO_SRC, SPECIALTIES, STATUS_META, formatDate, getBranchBySlug } from "@/lib/clinic";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "معلق" },
  { value: "confirmed", label: "مؤكد" },
  { value: "cancelled", label: "ملغى" },
];
const DEPARTMENTS = [
  { value: "dentistry", label: "الأسنان" },
  { value: "dermatology", label: "الجلدية" },
  { value: "laser", label: "الليزر" },
] as const;

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogFilter, setCatalogFilter] = useState<"all" | "active" | "paused">("all");
  const [newBookingCount, setNewBookingCount] = useState(0);
  const [serviceDraft, setServiceDraft] = useState<{ id: number; name: string; description: string; duration: number; department: "dentistry" | "dermatology" | "laser" }>({ id: 0, name: "", description: "", duration: 45, department: "dentistry" });
  const [branchDraft, setBranchDraft] = useState({ id: 0, slug: "", name: "", shortName: "", city: "", address: "", phone: "" });
  const [userDraft, setUserDraft] = useState({ username: "", name: "", password: "" });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const knownBookingIds = useRef<Set<number> | null>(null);

  const utils = trpc.useUtils();
  const { data: auth, isLoading: checkingAuth } = trpc.admin.checkAuth.useQuery();
  const authed = auth?.isAuthenticated ?? false;
  const { data: bookings, isLoading: loadingBookings, isFetching, refetch } = trpc.bookings.getAll.useQuery(undefined, {
    enabled: authed,
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
  });
  const { data: services } = trpc.services.listForAdmin.useQuery(undefined, { enabled: authed });
  const { data: branches } = trpc.branches.listForAdmin.useQuery(undefined, { enabled: authed });
  const { data: branchSpecialties } = trpc.branchSpecialties.listForAdmin.useQuery(undefined, { enabled: authed });
  const { data: dentists } = trpc.dentists.list.useQuery(undefined, { enabled: authed });
  const { data: adminUsers } = trpc.admin.users.list.useQuery(undefined, { enabled: authed });
  const { data: conversations } = trpc.assistant.conversations.list.useQuery({ limit: 20 }, { enabled: authed });
  const { data: conversationMessages } = trpc.assistant.conversations.messages.useQuery({ conversationId: selectedConversationId ?? 0 }, { enabled: authed && selectedConversationId !== null });
  const exportBookings = trpc.admin.exportBookings.useQuery(undefined, { enabled: false });

  useEffect(() => {
    if (!checkingAuth && !authed) navigate("/admin-login");
  }, [checkingAuth, authed, navigate]);

  const refreshAdminData = async () => {
    await Promise.all([
      utils.services.list.invalidate(),
      utils.services.listForAdmin.invalidate(),
      utils.branches.list.invalidate(),
      utils.branches.listForAdmin.invalidate(),
      utils.branchSpecialties.listForAdmin.invalidate(),
      utils.admin.users.list.invalidate(),
      utils.bookings.getAll.invalidate(),
      utils.assistant.conversations.list.invalidate(),
    ]);
  };

  const updateStatus = trpc.bookings.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.bookings.getAll.invalidate();
      toast.success("تم تحديث حالة الحجز");
    },
    onError: error => toast.error(error.message || "تعذر تحديث الحالة"),
  });
  const logout = trpc.admin.logout.useMutation({
    onSuccess: async () => {
      await utils.admin.checkAuth.invalidate();
      navigate("/admin-login");
    },
  });
  const createService = trpc.services.create.useMutation({
    onSuccess: async () => {
      await refreshAdminData();
      setServiceDraft({ id: 0, name: "", description: "", duration: 45, department: "dentistry" });
      toast.success("تمت إضافة الخدمة وفتحها للحجز");
    },
    onError: error => toast.error(error.message || "تعذرت إضافة الخدمة"),
  });
  const updateService = trpc.services.update.useMutation({
    onSuccess: async () => {
      await refreshAdminData();
      setServiceDraft({ id: 0, name: "", description: "", duration: 45, department: "dentistry" });
      toast.success("تم تحديث الخدمة");
    },
    onError: error => toast.error(error.message || "تعذر تحديث الخدمة"),
  });
  const setServiceActive = trpc.services.setActive.useMutation({
    onSuccess: async (_, variables) => {
      await refreshAdminData();
      toast.success(variables.isActive ? "أصبحت الخدمة متاحة للحجز" : "تم إيقاف حجز الخدمة");
    },
    onError: error => toast.error(error.message || "تعذر تحديث حالة الخدمة"),
  });
  const createBranch = trpc.branches.create.useMutation({ onSuccess: async () => { await refreshAdminData(); setBranchDraft({ id: 0, slug: "", name: "", shortName: "", city: "", address: "", phone: "" }); toast.success("تمت إضافة الفرع وفتحه للحجز"); }, onError: error => toast.error(error.message || "تعذرت إضافة الفرع") });
  const updateBranch = trpc.branches.update.useMutation({ onSuccess: async () => { await refreshAdminData(); setBranchDraft({ id: 0, slug: "", name: "", shortName: "", city: "", address: "", phone: "" }); toast.success("تم تحديث الفرع"); }, onError: error => toast.error(error.message || "تعذر تحديث الفرع") });
  const setBranchActive = trpc.branches.setActive.useMutation({ onSuccess: async (_, variables) => { await refreshAdminData(); toast.success(variables.isActive ? "أصبح الفرع متاحاً للحجز" : "تم إيقاف الفرع عن الحجز"); }, onError: error => toast.error(error.message || "تعذر تحديث حالة الفرع") });
  const setBranchSpecialtyActive = trpc.branchSpecialties.setActive.useMutation({ onSuccess: async () => { await refreshAdminData(); toast.success("تم تحديث تخصصات الفرع"); }, onError: error => toast.error(error.message || "تعذر تحديث تخصص الفرع") });
  const createAdminUser = trpc.admin.users.create.useMutation({
    onSuccess: async () => {
      await utils.admin.users.list.invalidate();
      setUserDraft({ username: "", name: "", password: "" });
      setEditingUser(null);
      toast.success("تمت إضافة المستخدم الإداري");
    },
    onError: error => toast.error(error.message || "تعذر إضافة المستخدم"),
  });
  const updateAdminUser = trpc.admin.users.update.useMutation({
    onSuccess: async () => {
      await utils.admin.users.list.invalidate();
      setUserDraft({ username: "", name: "", password: "" });
      setEditingUser(null);
      toast.success("تم تحديث الحساب الإداري");
    },
    onError: error => toast.error(error.message || "تعذر تحديث الحساب"),
  });
  const setAdminUserActive = trpc.admin.users.setActive.useMutation({
    onSuccess: async (_, variables) => {
      await utils.admin.users.list.invalidate();
      toast.success(variables.isActive ? "تم تفعيل المستخدم" : "تم تعطيل المستخدم");
    },
    onError: error => toast.error(error.message || "تعذر تحديث المستخدم"),
  });
  const removeAdminUser = trpc.admin.users.remove.useMutation({
    onSuccess: async () => {
      await utils.admin.users.list.invalidate();
      toast.success("تم حذف المستخدم الإداري");
    },
    onError: error => toast.error(error.message || "تعذر حذف المستخدم"),
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
    if (!arrived.length) return;
    setNewBookingCount(current => current + arrived.length);
    toast.success(arrived.length === 1 ? `وصل طلب حجز جديد باسم ${arrived[0].patientName}` : `وصلت ${arrived.length} طلبات حجز جديدة`);
  }, [bookings]);

  const stats = useMemo(() => {
    const list = bookings ?? [];
    return {
      total: list.length,
      pending: list.filter(booking => booking.status === "pending").length,
      confirmed: list.filter(booking => booking.status === "confirmed").length,
      cancelled: list.filter(booking => booking.status === "cancelled").length,
    };
  }, [bookings]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (bookings ?? []).filter(booking => {
      const branch = getBranchBySlug(booking.branch ?? undefined);
      return (filter === "all" || booking.status === filter) && (!term || booking.patientName.includes(term) || booking.patientPhone.includes(term) || branch?.name.includes(term) || booking.referenceNumber.toLowerCase().includes(term));
    });
  }, [bookings, filter, search]);
  const catalogStats = useMemo(() => {
    const branchList = branches ?? [];
    const serviceList = services ?? [];
    return {
      branches: branchList.length,
      activeBranches: branchList.filter(branch => branch.isActive).length,
      pausedBranches: branchList.filter(branch => !branch.isActive).length,
      services: serviceList.length,
      activeServices: serviceList.filter(service => service.isActive).length,
      pausedServices: serviceList.filter(service => !service.isActive).length,
    };
  }, [branches, services]);
  const matchesCatalog = (item: { isActive: boolean }, text: string) => {
    const term = catalogSearch.trim().toLowerCase();
    return (catalogFilter === "all" || (catalogFilter === "active" ? item.isActive : !item.isActive)) && (!term || text.toLowerCase().includes(term));
  };
  const filteredServices = useMemo(() => (services ?? []).filter(service => matchesCatalog(service, `${service.name} ${service.description ?? ""}`)), [services, catalogSearch, catalogFilter]);
  const filteredBranches = useMemo(() => (branches ?? []).filter(branch => matchesCatalog(branch, `${branch.name} ${branch.shortName} ${branch.city} ${branch.slug}`)), [branches, catalogSearch, catalogFilter]);

  const submitService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = { name: serviceDraft.name.trim(), description: serviceDraft.description.trim() || undefined, duration: Number(serviceDraft.duration), department: serviceDraft.department };
    if (!input.name || input.duration < 5) return toast.error("أدخل اسم الخدمة ومدة صالحة");
    if (serviceDraft.id) updateService.mutate({ id: serviceDraft.id, ...input });
    else createService.mutate(input);
  };
  const submitBranch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = { slug: branchDraft.slug.trim().toLowerCase(), name: branchDraft.name.trim(), shortName: branchDraft.shortName.trim(), city: branchDraft.city.trim(), address: branchDraft.address.trim() || undefined, phone: branchDraft.phone.trim() || undefined };
    if (!input.name || !input.shortName || !input.city || (!branchDraft.id && !/^[a-z0-9-]{3,64}$/.test(input.slug))) return toast.error("أدخل بيانات الفرع ورمزاً إنجليزياً صالحاً");
    if (branchDraft.id) updateBranch.mutate({ id: branchDraft.id, name: input.name, shortName: input.shortName, city: input.city, address: input.address, phone: input.phone });
    else createBranch.mutate(input);
  };
  const submitUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userDraft.username.trim()) return toast.error("اسم المستخدم مطلوب");
    if (editingUser) {
      if (!userDraft.name.trim() && userDraft.password.length < 8) return toast.error("أدخل اسماً أو كلمة مرور من 8 أحرف على الأقل");
      updateAdminUser.mutate({ username: editingUser, name: userDraft.name.trim() || undefined, password: userDraft.password || undefined });
      return;
    }
    if (userDraft.password.length < 8) return toast.error("كلمة مرور من 8 أحرف مطلوبة");
    createAdminUser.mutate({ username: userDraft.username.trim(), name: userDraft.name.trim() || undefined, password: userDraft.password });
  };
  const downloadBookings = async () => {
    const result = await exportBookings.refetch();
    if (result.error) return toast.error("تعذر تصدير الحجوزات");
    downloadCsv(result.data ?? []);
    toast.success("تم تجهيز ملف الحجوزات للتنزيل");
  };

  if (checkingAuth || !authed) return <div className="flex min-h-screen items-center justify-center bg-secondary/40"><Loader2 className="size-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4"><img src={LOGO_SRC} alt="مجموعة عيادات إيفان الطبية" className="h-10 w-auto" /><span className="hidden text-sm font-bold text-muted-foreground sm:block">لوحة إدارة الحجوزات والمحتوى</span></div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setNewBookingCount(0)} aria-label="عرض تنبيهات الحجوزات" className="relative grid size-10 place-items-center rounded-xl border border-border bg-white text-primary transition-all hover:shadow-sm"><BellRing className="size-4" />{newBookingCount > 0 && <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold leading-5 text-accent-foreground">{newBookingCount > 9 ? "9+" : newBookingCount}</span>}</button>
            <button type="button" onClick={() => logout.mutate()} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:shadow-sm"><LogOut className="size-4" />خروج</button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="إجمالي الحجوزات" value={stats.total} tone="text-primary" /><StatCard label="معلقة" value={stats.pending} tone="text-amber-600" /><StatCard label="مؤكدة" value={stats.confirmed} tone="text-emerald-600" /><StatCard label="ملغاة" value={stats.cancelled} tone="text-rose-600" />
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><span className="text-sm font-extrabold text-primary">نظرة تشغيلية سريعة</span><h2 className="mt-1 text-xl font-extrabold text-foreground">الفروع والخدمات</h2><p className="mt-1 text-sm text-muted-foreground">ابحث أو صفِّ العناصر من مكان واحد، ثم نفّذ التعديل أو الإيقاف مباشرة من القسم المناسب.</p></div><div className="relative w-full lg:max-w-md"><Search className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={catalogSearch} onChange={event => setCatalogSearch(event.target.value)} placeholder="ابحث باسم الفرع أو الخدمة أو المنطقة" className="w-full rounded-xl border border-border bg-secondary/20 py-2.5 pe-10 ps-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20" /></div></div>
          <div className="mt-4 flex flex-wrap gap-2">{([{ value: "all", label: "الكل" }, { value: "active", label: "النشط" }, { value: "paused", label: "الموقوف" }] as const).map(item => <button key={item.value} type="button" onClick={() => setCatalogFilter(item.value)} className={cn("rounded-lg px-3.5 py-2 text-xs font-bold transition-colors", catalogFilter === item.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70")}>{item.label}</button>)}</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><StatCard label="إجمالي الفروع" value={catalogStats.branches} tone="text-primary" /><StatCard label="فروع نشطة / موقوفة" value={`${catalogStats.activeBranches} / ${catalogStats.pausedBranches}`} tone="text-emerald-600" /><StatCard label="إجمالي الخدمات" value={catalogStats.services} tone="text-accent" /><StatCard label="خدمات نشطة / موقوفة" value={`${catalogStats.activeServices} / ${catalogStats.pausedServices}`} tone="text-emerald-600" /></div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"><Layers3 className="size-4" />التخصصات المعلنة</span><h2 className="mt-2 text-xl font-extrabold text-foreground">محتوى صفحة التخصصات</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">بطاقات مرجعية للتخصصات والصور المستخدمة في واجهة الموقع.</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{SPECIALTIES.length} تخصصات</span></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">{SPECIALTIES.map(specialty => <article key={specialty.id} className="overflow-hidden rounded-xl border border-border bg-secondary/20"><img src={specialty.image} alt="" className="h-24 w-full object-cover" /><div className="p-3"><p className="text-xs font-extrabold text-primary">{specialty.number}</p><h3 className="mt-1 text-sm font-extrabold text-foreground">{specialty.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{specialty.subtitle}</p></div></article>)}</div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 text-sm font-extrabold text-accent"><BookOpenCheck className="size-4" />خدمات الحجز</span><h2 className="mt-2 text-xl font-extrabold text-foreground">إدارة الخدمات</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">أضف خدمة أو عدّلها أو أوقف حجزها دون حذف الحجوزات السابقة.</p></div><span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-extrabold text-accent">{services?.length ?? 0} خدمات</span></div>
            <div className="mt-4 divide-y divide-border rounded-xl border border-border">{filteredServices.map(service => <div key={service.id} className="flex items-center justify-between gap-3 px-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">{service.name}</p><p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{DEPARTMENTS.find(item => item.value === service.department)?.label ?? "الأسنان"} · {service.description || "دون وصف"} · {service.duration} دقيقة</p></div><div className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={() => setServiceDraft({ id: service.id, name: service.name, description: service.description ?? "", duration: service.duration, department: service.department })} className="grid size-8 place-items-center rounded-lg bg-secondary text-secondary-foreground transition-all hover:shadow-sm" aria-label={`تعديل ${service.name}`}><Pencil className="size-3.5" /></button><button type="button" disabled={setServiceActive.isPending} onClick={() => setServiceActive.mutate({ id: service.id, isActive: !service.isActive })} className={cn("rounded-lg px-2 py-1.5 text-[10px] font-extrabold ring-1 transition-all hover:shadow-sm", service.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-rose-200")}>{service.isActive ? "ظاهر للحجز" : "موقوف"}</button></div></div>)}{!services?.length && <p className="px-3 py-6 text-center text-sm text-muted-foreground">جاري تحميل الخدمات...</p>}{!!services?.length && !filteredServices.length && <p className="px-3 py-6 text-center text-sm text-muted-foreground">لا توجد خدمات مطابقة للبحث أو التصفية.</p>}</div>
            <form onSubmit={submitService} className="mt-4 grid gap-2 rounded-xl bg-secondary/50 p-3 sm:grid-cols-[1.1fr_1.35fr_.7fr_.65fr_auto]"><input value={serviceDraft.name} onChange={event => setServiceDraft(current => ({ ...current, name: event.target.value }))} placeholder="اسم الخدمة" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><input value={serviceDraft.description} onChange={event => setServiceDraft(current => ({ ...current, description: event.target.value }))} placeholder="وصف مختصر" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><select value={serviceDraft.department} onChange={event => setServiceDraft(current => ({ ...current, department: event.target.value as typeof current.department }))} className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary">{DEPARTMENTS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select><input type="number" min="5" max="240" value={serviceDraft.duration} onChange={event => setServiceDraft(current => ({ ...current, duration: Number(event.target.value) }))} aria-label="مدة الخدمة بالدقائق" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><div className="flex gap-2"><button type="submit" disabled={createService.isPending || updateService.isPending} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-extrabold text-primary-foreground transition-all hover:shadow-sm"><Plus className="size-3.5" />{serviceDraft.id ? "حفظ" : "إضافة"}</button>{serviceDraft.id > 0 && <button type="button" onClick={() => setServiceDraft({ id: 0, name: "", description: "", duration: 45, department: "dentistry" })} className="rounded-lg border border-border bg-white px-3 text-xs font-bold text-muted-foreground">إلغاء</button>}</div></form>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"><Building2 className="size-4" />الفروع</span><h2 className="mt-2 text-xl font-extrabold text-foreground">إدارة الفروع والتشغيل</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">أضف فرعاً أو عدّل بياناته أو أوقف الحجز فيه دون التأثير على الحجوزات المسجلة سابقاً.</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{branches?.filter(branch => branch.isActive).length ?? 0} نشط</span></div>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border">{filteredBranches.map(branch => {
            const settings = (branchSpecialties ?? []).filter(item => item.branchId === branch.id);
            return <div key={branch.id} className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">{branch.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{branch.city} · <span dir="ltr">{branch.slug}</span></p><div className="mt-2 flex flex-wrap gap-1.5">{DEPARTMENTS.map(department => { const setting = settings.find(item => item.department === department.value); const active = setting?.isActive ?? true; return <button key={department.value} type="button" disabled={setBranchSpecialtyActive.isPending} onClick={() => setBranchSpecialtyActive.mutate({ branchId: branch.id, department: department.value, isActive: !active })} className={cn("rounded-md px-2 py-1 text-[10px] font-extrabold ring-1 transition-colors", active ? "bg-sky-50 text-sky-700 ring-sky-200 hover:bg-sky-100" : "bg-secondary text-muted-foreground ring-border hover:bg-secondary/70")}>{department.label}: {active ? "مفعل" : "موقوف"}</button>; })}</div></div><div className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={() => setBranchDraft({ id: branch.id, slug: branch.slug, name: branch.name, shortName: branch.shortName, city: branch.city, address: branch.address ?? "", phone: branch.phone ?? "" })} className="grid size-8 place-items-center rounded-lg bg-secondary text-secondary-foreground transition-all hover:shadow-sm" aria-label={`تعديل ${branch.name}`}><Pencil className="size-3.5" /></button><button type="button" disabled={setBranchActive.isPending} onClick={() => setBranchActive.mutate({ id: branch.id, isActive: !branch.isActive })} className={cn("rounded-lg px-2 py-1.5 text-[10px] font-extrabold ring-1 transition-all hover:shadow-sm", branch.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-rose-200")}>{branch.isActive ? "ظاهر للحجز" : "موقوف"}</button></div></div>; })}{!branches?.length && <p className="px-3 py-6 text-center text-sm text-muted-foreground">جاري تحميل الفروع...</p>}{!!branches?.length && !filteredBranches.length && <p className="px-3 py-6 text-center text-sm text-muted-foreground">لا توجد فروع مطابقة للبحث أو التصفية.</p>}</div>
          <form onSubmit={submitBranch} className="mt-4 grid gap-2 rounded-xl bg-secondary/50 p-3 sm:grid-cols-2 lg:grid-cols-[.8fr_1.2fr_1fr_1fr_1.3fr_1fr_auto]"><input value={branchDraft.slug} disabled={branchDraft.id > 0} onChange={event => setBranchDraft(current => ({ ...current, slug: event.target.value }))} placeholder="رمز الفرع" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary disabled:bg-secondary" /><input value={branchDraft.name} onChange={event => setBranchDraft(current => ({ ...current, name: event.target.value }))} placeholder="اسم الفرع" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><input value={branchDraft.shortName} onChange={event => setBranchDraft(current => ({ ...current, shortName: event.target.value }))} placeholder="الاسم المختصر" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><input value={branchDraft.city} onChange={event => setBranchDraft(current => ({ ...current, city: event.target.value }))} placeholder="المدينة / المنطقة" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><input value={branchDraft.address} onChange={event => setBranchDraft(current => ({ ...current, address: event.target.value }))} placeholder="العنوان" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><input value={branchDraft.phone} onChange={event => setBranchDraft(current => ({ ...current, phone: event.target.value }))} placeholder="رقم الهاتف" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><div className="flex gap-2"><button type="submit" disabled={createBranch.isPending || updateBranch.isPending} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-extrabold text-primary-foreground transition-all hover:shadow-sm"><Plus className="size-3.5" />{branchDraft.id ? "حفظ" : "إضافة"}</button>{branchDraft.id > 0 && <button type="button" onClick={() => setBranchDraft({ id: 0, slug: "", name: "", shortName: "", city: "", address: "", phone: "" })} className="rounded-lg border border-border bg-white px-3 text-xs font-bold text-muted-foreground">إلغاء</button>}</div></form>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"><UserCog className="size-4" />المستخدمون الإداريون</span><h2 className="mt-2 text-xl font-extrabold text-foreground">التحكم في الوصول</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">إضافة مسؤولين، تعطيل الوصول، أو حذف الحسابات غير المستخدمة مع حماية آخر مسؤول نشط.</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{adminUsers?.filter(user => user.isActive).length ?? 0} نشط</span></div>
            <div className="mt-4 divide-y divide-border rounded-xl border border-border">{(adminUsers ?? []).map(user => <div key={user.id} className="flex items-center justify-between gap-3 px-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">{user.name || user.username || "مسؤول"}</p><p dir="ltr" className="mt-0.5 text-xs text-muted-foreground">{user.username || "OAuth admin"}</p></div><div className="flex items-center gap-1.5"><span className={cn("rounded-full px-2 py-1 text-[10px] font-extrabold ring-1", user.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-secondary text-muted-foreground ring-border")}>{user.isActive ? "نشط" : "معطل"}</span>{user.username && <button type="button" onClick={() => { setEditingUser(user.username ?? null); setUserDraft({ username: user.username ?? "", name: user.name ?? "", password: "" }); }} className="grid size-8 place-items-center rounded-lg bg-secondary text-secondary-foreground transition-all hover:shadow-sm" aria-label="تعديل الحساب"><Pencil className="size-3.5" /></button>}{user.username && <button type="button" disabled={setAdminUserActive.isPending} onClick={() => setAdminUserActive.mutate({ username: user.username ?? "", isActive: !user.isActive })} className="grid size-8 place-items-center rounded-lg bg-secondary text-secondary-foreground transition-all hover:shadow-sm" aria-label={user.isActive ? "تعطيل المستخدم" : "تفعيل المستخدم"}><Power className="size-3.5" /></button>}{user.username && <button type="button" disabled={removeAdminUser.isPending} onClick={() => { if (window.confirm(`حذف المستخدم ${user.username}؟`)) removeAdminUser.mutate({ username: user.username ?? "" }); }} className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-200 transition-all hover:shadow-sm" aria-label="حذف المستخدم"><Trash2 className="size-3.5" /></button>}</div></div>)}{!adminUsers?.length && <p className="px-3 py-6 text-center text-sm text-muted-foreground">جاري تحميل المستخدمين...</p>}</div>
            <form onSubmit={submitUser} className="mt-4 grid gap-2 rounded-xl bg-secondary/50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"><input value={userDraft.username} disabled={!!editingUser} onChange={event => setUserDraft(current => ({ ...current, username: event.target.value }))} placeholder="اسم المستخدم" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary disabled:bg-secondary disabled:text-muted-foreground" /><input value={userDraft.name} onChange={event => setUserDraft(current => ({ ...current, name: event.target.value }))} placeholder="الاسم الظاهر" className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><input type="password" value={userDraft.password} onChange={event => setUserDraft(current => ({ ...current, password: event.target.value }))} placeholder={editingUser ? "كلمة مرور جديدة (اختياري)" : "كلمة مرور (8 أحرف+)"} className="rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><div className="flex gap-2"><button type="submit" disabled={createAdminUser.isPending || updateAdminUser.isPending} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-extrabold text-primary-foreground transition-all hover:shadow-sm"><UserPlus className="size-3.5" />{editingUser ? "حفظ" : "إضافة"}</button>{editingUser && <button type="button" onClick={() => { setEditingUser(null); setUserDraft({ username: "", name: "", password: "" }); }} className="rounded-lg border border-border bg-white px-3 text-xs font-bold text-muted-foreground">إلغاء</button>}</div></form>
          </div>
          <div className="rounded-2xl border border-border bg-primary p-5 text-primary-foreground shadow-sm"><span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary-foreground/90"><Download className="size-4" />تصدير البيانات</span><h2 className="mt-2 text-xl font-extrabold">ملف الحجوزات التشغيلي</h2><p className="mt-2 text-sm leading-6 text-primary-foreground/75">تنزيل CSV منظم يتضمن بيانات المراجع والفرع والخدمة والطبيب والموعد والحالة، للاستخدام التشغيلي أو الاستيراد لاحقاً في CRM.</p><button type="button" onClick={downloadBookings} disabled={exportBookings.isFetching} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-primary transition-all hover:shadow-md disabled:opacity-70"><Download className="size-4" />{exportBookings.isFetching ? "جارٍ تجهيز الملف..." : "تصدير الحجوزات CSV"}</button><p className="mt-3 text-xs leading-5 text-primary-foreground/65">يُطلب تسجيل دخول إداري صالح قبل إنشاء الملف، ولا يتاح التصدير للعامة.</p></div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4"><div><span className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"><MessageSquareText className="size-4" />سجل مساعد إيفان</span><h2 className="mt-2 text-xl font-extrabold text-foreground">جلسات المحادثة الأخيرة</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">سجل تشغيلي محمي برمز جلسة، وجاهز للمزامنة مع CRM عند اعتماد القناة.</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{conversations?.length ?? 0}</span></div>
            <div className="mt-4 max-h-[360px] divide-y divide-border overflow-y-auto rounded-xl border border-border">
              {(conversations ?? []).map(conversation => <button type="button" key={conversation.id} onClick={() => setSelectedConversationId(conversation.id)} className={cn("flex w-full items-center justify-between gap-3 px-3 py-3 text-right transition-colors hover:bg-secondary/40", selectedConversationId === conversation.id && "bg-primary/5")}><div className="min-w-0"><p className="text-sm font-bold text-foreground">جلسة موقع إلكتروني</p><p dir="ltr" className="mt-1 truncate text-xs text-muted-foreground">…{conversation.sessionKey.slice(-10)}</p></div><time className="shrink-0 text-xs text-muted-foreground">{new Date(conversation.lastMessageAt).toLocaleDateString("ar-SA", { day: "numeric", month: "short" })}</time></button>)}
              {!conversations?.length && <p className="px-3 py-8 text-center text-sm text-muted-foreground">لا توجد محادثات مسجلة بعد.</p>}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div><span className="inline-flex items-center gap-2 text-sm font-extrabold text-accent"><MessageSquareText className="size-4" />تفاصيل الجلسة</span><h2 className="mt-2 text-xl font-extrabold text-foreground">مراجعة الرسائل</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">تظهر الرسائل للمسؤولين فقط. لا يعتمد السجل كتشخيص طبي أو كبديل لملف المراجع الطبي.</p></div>
            <div className="mt-5 min-h-[236px] space-y-3 rounded-xl bg-secondary/35 p-4">
              {selectedConversationId === null && <p className="py-16 text-center text-sm text-muted-foreground">اختر جلسة من القائمة لمراجعة رسائلها.</p>}
              {selectedConversationId !== null && !conversationMessages?.length && <p className="py-16 text-center text-sm text-muted-foreground">جارٍ تحميل الرسائل أو لا توجد رسائل في هذه الجلسة.</p>}
              {(conversationMessages ?? []).map(message => <div key={message.id} className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7", message.role === "assistant" ? "ml-auto bg-white text-foreground shadow-sm" : "mr-auto bg-primary text-primary-foreground")}><span className="mb-1 block text-[10px] font-extrabold opacity-70">{message.role === "assistant" ? "مساعد إيفان" : "المراجع"}</span>{message.content}</div>)}
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center"><div className="relative flex-1"><Search className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="text" value={search} onChange={event => setSearch(event.target.value)} placeholder="ابحث بالاسم أو الجوال أو الرقم المرجعي" className="w-full rounded-xl border border-border bg-white py-2.5 pe-10 ps-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20" /></div><div className="flex flex-wrap items-center gap-1.5">{FILTERS.map(item => <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={cn("rounded-lg px-3.5 py-2 text-xs font-bold transition-colors", filter === item.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70")}>{item.label}</button>)}<button type="button" onClick={() => refetch()} aria-label="تحديث" className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-primary"><RefreshCw className={cn("size-4", isFetching && "animate-spin")} /></button></div></div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">{loadingBookings && <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground"><Loader2 className="size-5 animate-spin" />جاري تحميل الحجوزات...</div>}{!loadingBookings && filtered.length === 0 && <div className="py-16 text-center"><CalendarClock className="mx-auto size-10 text-muted-foreground/50" /><p className="mt-3 text-sm text-muted-foreground">لا توجد حجوزات مطابقة.</p></div>}{!loadingBookings && filtered.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-sm"><thead><tr className="border-b border-border bg-secondary/50 text-right"><Th>الرقم المرجعي</Th><Th>المريض</Th><Th>الجوال</Th><Th>الفرع</Th><Th>الموعد</Th><Th>الخدمة</Th><Th>الطبيب</Th><Th>الحالة</Th><Th>إجراءات</Th></tr></thead><tbody>{filtered.map(booking => { const meta = STATUS_META[booking.status as keyof typeof STATUS_META]; const service = services?.find(item => item.id === booking.serviceId); const dentist = dentists?.find(item => item.id === booking.dentistId); const branch = getBranchBySlug(booking.branch ?? undefined); const busy = updateStatus.isPending; return <tr key={booking.id} className="border-b border-border transition-colors last:border-0 hover:bg-secondary/30"><Td><span dir="ltr" className="font-mono text-xs font-bold text-primary">{booking.referenceNumber}</span></Td><Td><span className="font-semibold text-foreground">{booking.patientName}</span></Td><Td><span dir="ltr" className="block text-right">{booking.patientPhone}</span></Td><Td><span className="font-semibold text-foreground">{branch?.shortName ?? "غير محدد"}</span></Td><Td><span className="block text-foreground">{formatDate(booking.appointmentDate)}</span><span dir="ltr" className="block text-xs text-muted-foreground">{String(booking.appointmentTime).slice(0, 5)}</span></Td><Td>{service?.name ?? "-"}</Td><Td>{dentist?.name ?? "-"}</Td><Td><span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", meta?.className)}>{meta?.label}</span></Td><Td><div className="flex items-center gap-1.5">{booking.status !== "confirmed" && <button type="button" disabled={busy} onClick={() => updateStatus.mutate({ referenceNumber: booking.referenceNumber, status: "confirmed" })} aria-label="تأكيد" className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 transition-all hover:shadow-sm disabled:opacity-50"><CheckCircle2 className="size-4" /></button>}{booking.status !== "cancelled" && <button type="button" disabled={busy} onClick={() => updateStatus.mutate({ referenceNumber: booking.referenceNumber, status: "cancelled" })} aria-label="إلغاء" className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-200 transition-all hover:shadow-sm disabled:opacity-50"><XCircle className="size-4" /></button>}</div></Td></tr>; })}</tbody></table></div>}</div>
      </main>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md"><p className="text-sm font-semibold text-muted-foreground">{label}</p><p className={cn("mt-2 text-3xl font-extrabold", tone)}>{value}</p></div>;
}
function Th({ children }: { children: React.ReactNode }) { return <th className="whitespace-nowrap px-4 py-3.5 text-xs font-bold text-muted-foreground">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">{children}</td>; }
function downloadCsv(rows: Array<Record<string, string>>) {
  const headers = ["الرقم المرجعي", "اسم المراجع", "الجوال", "الفرع", "التاريخ", "الوقت", "الحالة", "الخدمة", "الطبيب", "ملاحظات"];
  const escape = (value: string) => `"${String(value).replaceAll('"', '""')}"`;
  const content = [headers.join(","), ...rows.map(row => [row.referenceNumber, row.patientName, row.patientPhone, row.branch, row.appointmentDate, row.appointmentTime, row.status, row.service, row.dentist, row.notes].map(escape).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `evan-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
