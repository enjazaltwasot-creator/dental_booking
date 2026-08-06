import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const { data: authData } = trpc.admin.checkAuth.useQuery();
  
  useEffect(() => {
    if (authData?.isAuthenticated === false) {
      navigate('/admin-login');
    } else if (authData?.isAuthenticated === true) {
      setIsAuthenticated(true);
    }
  }, [authData?.isAuthenticated, navigate]);

  const { data: bookings, isLoading, refetch } = trpc.bookings.getAll.useQuery();
  const updateStatusMutation = trpc.bookings.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      setIsAuthenticated(false);
      navigate('/');
    },
  });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const handleStatusUpdate = async (referenceNumber: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    await updateStatusMutation.mutateAsync({
      referenceNumber,
      status: newStatus,
    });
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600 font-semibold">جاري التحميل...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredBookings = (bookings || [])?.filter(booking => {
    const matchesSearch = 
      booking.patientName.includes(searchTerm) ||
      booking.patientPhone.includes(searchTerm) ||
      booking.referenceNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: '#FEF3C7', text: '#92400E', label: 'معلق' },
      confirmed: { bg: '#DCFCE7', text: '#166534', label: 'مؤكد' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B', label: 'ملغى' },
    };
    return statusMap[status] || statusMap.pending;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img 
            src="/manus-storage/evan-clinic-logo_3b9cca8a.webp" 
            alt="Evan Clinic" 
            className="h-12 w-auto"
          />
          <h1 className="text-2xl font-bold text-slate-900">لوحة التحكم</h1>
          <button
            onClick={handleLogout}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i>
            تسجيل خروج
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">إدارة الحجوزات</h2>
          <p className="text-lg text-slate-600">عرض وإدارة جميع حجوزات المرضى</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute right-4 top-3.5 text-slate-400"></i>
              <input
                type="text"
                placeholder="ابحث عن المريض أو رقم الجوال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-lg border-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">معلق</option>
              <option value="confirmed">مؤكد</option>
              <option value="cancelled">ملغى</option>
            </select>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold transition"
            >
              تحديث
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-right font-bold text-slate-900">رقم المرجع</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-900">اسم المريض</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-900">رقم الجوال</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-900">التاريخ والوقت</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-900">الحالة</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings?.map((booking) => {
                  const statusBadge = getStatusBadge(booking.status);
                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                        {booking.referenceNumber}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {booking.patientName}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {booking.patientPhone}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(booking.appointmentDate).toLocaleDateString('ar-SA')} - {booking.appointmentTime}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold"
                          style={{
                            backgroundColor: statusBadge.bg,
                            color: statusBadge.text,
                          }}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {booking.status !== 'confirmed' && (
                            <button
                              onClick={() => handleStatusUpdate(booking.referenceNumber, 'confirmed')}
                              disabled={updateStatusMutation.isPending}
                              className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition disabled:opacity-50"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusUpdate(booking.referenceNumber, 'cancelled')}
                              disabled={updateStatusMutation.isPending}
                              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBookings?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600 font-semibold">لا توجد حجوزات</p>
          </div>
        )}

        {/* Stats */}
        {bookings && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="rounded-xl bg-white border border-slate-100 p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-yellow-500 mb-2">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <p className="text-slate-600 font-semibold">حجوزات معلقة</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-green-500 mb-2">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <p className="text-slate-600 font-semibold">حجوزات مؤكدة</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-red-500 mb-2">
                {bookings.filter(b => b.status === 'cancelled').length}
              </div>
              <p className="text-slate-600 font-semibold">حجوزات ملغاة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
