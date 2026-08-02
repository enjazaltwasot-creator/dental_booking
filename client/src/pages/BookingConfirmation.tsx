import { useRoute } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function BookingConfirmation() {
  const [match, params] = useRoute('/confirmation/:referenceNumber');
  const [, navigate] = useLocation();
  const referenceNumber = params?.referenceNumber as string;

  const { data: booking, isLoading } = trpc.bookings.getByReferenceNumber.useQuery(
    { referenceNumber: referenceNumber || '' },
    { enabled: !!referenceNumber }
  );

  const { data: dentist } = trpc.dentists.getById.useQuery(
    { id: booking?.dentistId || 0 },
    { enabled: !!booking?.dentistId }
  );

  const { data: service } = trpc.services.getById.useQuery(
    { id: booking?.serviceId || 0 },
    { enabled: !!booking?.serviceId }
  );

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-calming flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen gradient-calming py-12">
        <div className="container max-w-2xl mx-auto">
          <Card className="card-elegant text-center">
            <h1 className="text-2xl font-bold mb-4">لم يتم العثور على الحجز</h1>
            <p className="text-muted-foreground mb-6">
              عذراً، لم نتمكن من العثور على الحجز برقم {referenceNumber}
            </p>
            <Button onClick={() => navigate('/')} className="btn-elegant">
              العودة للرئيسية
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  return (
    <div className="min-h-screen gradient-calming py-12">
      <div className="container max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">تم تأكيد حجزك!</h1>
          <p className="text-muted-foreground">
            شكراً لاختيارك عيادتنا. سيتم تأكيد موعدك قريباً.
          </p>
        </div>

        {/* Booking Details */}
        <Card className="card-elegant mb-6">
          <div className="mb-6 pb-6 border-b border-muted">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">رقم المرجع</p>
                <p className="text-2xl font-bold text-accent">{booking.referenceNumber}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(booking.status)}`}>
                {getStatusLabel(booking.status)}
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">طبيب الأسنان</p>
              <p className="text-lg font-semibold">{dentist?.name}</p>
              <p className="text-sm text-muted-foreground">{dentist?.specialization}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">الخدمة</p>
              <p className="text-lg font-semibold">{service?.name}</p>
              <p className="text-sm text-muted-foreground">المدة: {service?.duration} دقيقة</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">التاريخ</p>
              <p className="text-lg font-semibold">{formatDate(booking.appointmentDate)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">الوقت</p>
              <p className="text-lg font-semibold">{booking.appointmentTime}</p>
            </div>
          </div>

          {/* Patient Information */}
          <div className="mb-6 pb-6 border-t border-muted pt-6">
            <h3 className="text-lg font-semibold mb-4">بيانات المريض</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">الاسم</p>
                <p className="font-semibold">{booking.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">رقم الهاتف</p>
                <p className="font-semibold">{booking.patientPhone}</p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>ملاحظة مهمة:</strong> سيتم تأكيد موعدك من قبل العيادة قريباً. يرجى الانتظار للحصول على رسالة تأكيد عبر الهاتف.
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(booking.referenceNumber);
              alert('تم نسخ رقم المرجع!');
            }}
            variant="outline"
          >
            نسخ رقم المرجع
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="btn-elegant"
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}
