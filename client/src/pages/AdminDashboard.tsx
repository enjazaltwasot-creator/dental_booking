import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { CheckCircle, XCircle, Clock, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Check authentication on mount
  const { data: authData } = trpc.admin.checkAuth.useQuery();
  
  useEffect(() => {
    if (authData?.isAuthenticated === false) {
      navigate('/admin-login');
    } else if (authData?.isAuthenticated === true) {
      setIsAuthenticated(true);
    }
  }, [authData?.isAuthenticated, navigate]);

  useEffect(() => {
    if (authData === undefined) {
      setIsAuthenticated(null);
    }
  }, [authData]);

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

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      setIsAuthenticated(false);
      toast.success('تم تسجيل الخروج بنجاح');
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
      <div className="min-h-screen gradient-calming flex items-center justify-center">
        <Spinner />
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'مؤكد';
      case 'cancelled':
        return 'ملغى';
      case 'pending':
      default:
        return 'معلق';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      case 'pending':
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen gradient-calming py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-700 mb-2">
              لوحة التحكم الإدارية
            </h1>
            <p className="text-muted-foreground">
              إدارة جميع حجوزات المواعيد
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="card-elegant mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                البحث
              </label>
              <Input
                type="text"
                placeholder="ابحث بالاسم أو الهاتف أو رقم المرجع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                تصفية الحالة
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">معلق</option>
                <option value="confirmed">مؤكد</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => refetch()}
                className="btn-elegant w-full"
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
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                لا توجد حجوزات متطابقة
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      رقم المرجع
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      اسم المريض
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      التاريخ والوقت
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-700">
                        {booking.referenceNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {booking.patientName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {booking.patientPhone}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(booking.appointmentDate).toLocaleDateString('ar-SA')} - {booking.appointmentTime}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {getStatusLabel(booking.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {booking.status !== 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(booking.referenceNumber, 'confirmed')}
                              disabled={updateStatusMutation.isPending}
                              className="text-xs bg-green-600 hover:bg-green-700 text-white"
                            >
                              تأكيد
                            </Button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(booking.referenceNumber, 'cancelled')}
                              disabled={updateStatusMutation.isPending}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white"
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

        {/* Stats */}
        {bookings && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="card-elegant p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <p className="text-muted-foreground">حجوزات معلقة</p>
            </Card>
            <Card className="card-elegant p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <p className="text-muted-foreground">حجوزات مؤكدة</p>
            </Card>
            <Card className="card-elegant p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {bookings.filter(b => b.status === 'cancelled').length}
              </div>
              <p className="text-muted-foreground">حجوزات ملغاة</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
