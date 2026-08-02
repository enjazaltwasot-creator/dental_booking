import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (isAuthenticated !== undefined && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/');
    }
  }, [isAuthenticated, user?.role, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen gradient-calming py-12">
        <div className="container max-w-2xl mx-auto">
          <Card className="card-elegant text-center">
            <h1 className="text-2xl font-bold mb-4">وصول مرفوض</h1>
            <p className="text-muted-foreground mb-6">
              عذراً، لا تملك صلاحيات للوصول إلى لوحة التحكم الإدارية
            </p>
            <Button onClick={() => navigate('/')} className="btn-elegant">
              العودة للرئيسية
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const { data: bookings, isLoading, refetch } = trpc.bookings.getAll.useQuery();
  const updateStatusMutation = trpc.bookings.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث حالة الحجز بنجاح');
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter(booking => {
      const matchesSearch =
        booking.patientName.includes(searchTerm) ||
        booking.patientPhone.includes(searchTerm) ||
        booking.referenceNumber.includes(searchTerm);

      const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, filterStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'معلق',
      confirmed: 'مؤكد',
      cancelled: 'ملغى',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const stats = useMemo(() => {
    if (!bookings) return { total: 0, pending: 0, confirmed: 0, cancelled: 0 };
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  }, [bookings]);

  return (
    <div className="min-h-screen gradient-calming py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-muted-foreground">إدارة جميع حجوزات العيادة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'إجمالي الحجوزات', value: stats.total, color: 'bg-blue-100 text-blue-800' },
            { label: 'معلقة', value: stats.pending, color: 'bg-yellow-100 text-yellow-800' },
            { label: 'مؤكدة', value: stats.confirmed, color: 'bg-green-100 text-green-800' },
            { label: 'ملغاة', value: stats.cancelled, color: 'bg-red-100 text-red-800' },
          ].map((stat, idx) => (
            <Card key={idx} className="card-elegant">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold px-3 py-2 rounded-lg ${stat.color} inline-block`}>
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="card-elegant mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">البحث</label>
              <Input
                type="text"
                placeholder="ابحث برقم المرجع أو اسم المريض أو الهاتف"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-elegant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الحالة</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="input-elegant"
              >
                <option value="all">الكل</option>
                <option value="pending">معلق</option>
                <option value="confirmed">مؤكد</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => refetch()}
                className="w-full btn-elegant"
              >
                تحديث
              </Button>
            </div>
          </div>
        </Card>

        {/* Bookings Table */}
        <Card className="card-elegant overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد حجوزات مطابقة للبحث
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-muted">
                  <tr>
                    <th className="px-6 py-3 text-right font-semibold">رقم المرجع</th>
                    <th className="px-6 py-3 text-right font-semibold">المريض</th>
                    <th className="px-6 py-3 text-right font-semibold">التاريخ والوقت</th>
                    <th className="px-6 py-3 text-right font-semibold">الحالة</th>
                    <th className="px-6 py-3 text-right font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-muted hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-accent">
                          {booking.referenceNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{booking.patientName}</p>
                          <p className="text-sm text-muted-foreground">{booking.patientPhone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p>{formatDate(booking.appointmentDate)}</p>
                          <p className="text-sm text-muted-foreground">{booking.appointmentTime}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {booking.status !== 'confirmed' && (
                            <Button
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  referenceNumber: booking.referenceNumber,
                                  status: 'confirmed',
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              تأكيد
                            </Button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <Button
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  referenceNumber: booking.referenceNumber,
                                  status: 'cancelled',
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                              size="sm"
                              variant="destructive"
                            >
                              إلغاء
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
