import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Search, Check, X, LogOut } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <p style={{ color: '#2563eb' }} className="text-lg font-semibold">جاري التحميل...</p>
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
      pending: { bg: '#fef3c7', text: '#92400e', label: 'معلق' },
      confirmed: { bg: '#dcfce7', text: '#166534', label: 'مؤكد' },
      cancelled: { bg: '#fee2e2', text: '#991b1b', label: 'ملغى' },
    };
    return statusMap[status] || statusMap.pending;
  };

  const styles = {
    headerBg: { background: 'linear-gradient(to right, #1e3a8a, #1e40af)' },
    containerBg: { backgroundColor: '#f8fafc' },
    cardBg: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
    blueText: { color: '#2563eb' },
    darkBlueText: { color: '#1e3a8a' },
    orangeBtn: { backgroundColor: '#ff6600', color: 'white' },
    greenBtn: { backgroundColor: '#22c55e', color: 'white' },
    redBtn: { backgroundColor: '#ef4444', color: 'white' },
    inputBorder: { borderColor: '#cbd5e1' },
  };

  return (
    <div style={styles.containerBg} className="min-h-screen py-12">
      {/* Header */}
      <header className="sticky top-0 z-40 shadow-lg" style={styles.headerBg}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/manus-storage/evan-clinic-logo_3b9cca8a.webp" 
              alt="Evan Clinic" 
              className="h-14 w-auto"
            />
            <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2"
            style={styles.orangeBtn}
          >
            <LogOut className="w-4 h-4" />
            تسجيل خروج
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2" style={styles.blueText}>
            إدارة الحجوزات
          </h2>
          <p style={{ color: '#64748b' }}>عرض وإدارة جميع حجوزات المرضى</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-3.5 w-5 h-5" style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="ابحث عن المريض أو رقم الجوال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-2 font-semibold outline-none focus:outline-none bg-transparent"
                style={{ borderBottom: '1px solid #cbd5e1', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 rounded-lg border-2 font-semibold"
              style={styles.inputBorder}
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">معلق</option>
              <option value="confirmed">مؤكد</option>
              <option value="cancelled">ملغى</option>
            </select>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
              style={styles.blueText}
            >
              تحديث
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="rounded-2xl overflow-hidden shadow-lg" style={styles.cardBg}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                  <th className="px-6 py-4 text-right font-bold" style={styles.darkBlueText}>
                    رقم المرجع
                  </th>
                  <th className="px-6 py-4 text-right font-bold" style={styles.darkBlueText}>
                    اسم المريض
                  </th>
                  <th className="px-6 py-4 text-right font-bold" style={styles.darkBlueText}>
                    رقم الجوال
                  </th>
                  <th className="px-6 py-4 text-right font-bold" style={styles.darkBlueText}>
                    التاريخ والوقت
                  </th>
                  <th className="px-6 py-4 text-right font-bold" style={styles.darkBlueText}>
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right font-bold" style={styles.darkBlueText}>
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings?.map((booking) => {
                  const statusBadge = getStatusBadge(booking.status);
                  return (
                    <tr
                      key={booking.id}
                      style={{ borderBottom: '1px solid #e2e8f0' }}
                    >
                      <td className="px-6 py-4 font-mono font-semibold" style={styles.darkBlueText}>
                        {booking.referenceNumber}
                      </td>
                      <td className="px-6 py-4 font-semibold" style={styles.darkBlueText}>
                        {booking.patientName}
                      </td>
                      <td className="px-6 py-4" style={{ color: '#64748b' }}>
                        {booking.patientPhone}
                      </td>
                      <td className="px-6 py-4" style={{ color: '#64748b' }}>
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
                              className="p-2 rounded-lg transition-all hover:opacity-80 flex items-center gap-1"
                              style={styles.greenBtn}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusUpdate(booking.referenceNumber, 'cancelled')}
                              disabled={updateStatusMutation.isPending}
                              className="p-2 rounded-lg transition-all hover:opacity-80 flex items-center gap-1"
                              style={styles.redBtn}
                            >
                              <X className="w-4 h-4" />
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
            <p style={styles.blueText} className="text-lg font-semibold">
              لا توجد حجوزات
            </p>
          </div>
        )}

        {/* Stats */}
        {bookings && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="rounded-2xl p-6 text-center shadow-md" style={styles.cardBg}>
              <div className="text-4xl font-bold mb-2" style={{ color: '#f59e0b' }}>
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <p style={{ color: '#64748b' }} className="font-semibold">حجوزات معلقة</p>
            </div>
            <div className="rounded-2xl p-6 text-center shadow-md" style={styles.cardBg}>
              <div className="text-4xl font-bold mb-2" style={{ color: '#22c55e' }}>
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <p style={{ color: '#64748b' }} className="font-semibold">حجوزات مؤكدة</p>
            </div>
            <div className="rounded-2xl p-6 text-center shadow-md" style={styles.cardBg}>
              <div className="text-4xl font-bold mb-2" style={{ color: '#ef4444' }}>
                {bookings.filter(b => b.status === 'cancelled').length}
              </div>
              <p style={{ color: '#64748b' }} className="font-semibold">حجوزات ملغاة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
