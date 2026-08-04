import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Star, MapPin, Phone } from 'lucide-react';

export default function DoctorsList() {
  const [, navigate] = useLocation();
  const { data: doctors, isLoading, error, refetch } = trpc.dentists.list.useQuery();

  const getSpecializationIcon = (specialization: string) => {
    const icons: Record<string, string> = {
      'تنظيف الأسنان': '😁',
      'حشو الأسنان': '🦷',
      'تقويم الأسنان': '👥',
      'خلع الأسنان': '⚕️',
      'تبييض الأسنان': '✨',
      'زراعة الأسنان': '🌱',
    };
    return icons[specialization] || '🦷';
  };

  const getSpecializationColor = (specialization: string) => {
    const colors: Record<string, string> = {
      'تنظيف الأسنان': 'from-blue-100 to-blue-50',
      'حشو الأسنان': 'from-purple-100 to-purple-50',
      'تقويم الأسنان': 'from-pink-100 to-pink-50',
      'خلع الأسنان': 'from-red-100 to-red-50',
      'تبييض الأسنان': 'from-yellow-100 to-yellow-50',
      'زراعة الأسنان': 'from-green-100 to-green-50',
    };
    return colors[specialization] || 'from-slate-100 to-slate-50';
  };

  return (
    <div className="min-h-screen gradient-calming py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-slate-700 mb-2">أطباؤنا المتخصصون</h1>
          <p className="text-muted-foreground text-lg">فريق من أفضل أطباء الأسنان المتخصصين</p>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Card className="card-elegant max-w-md mx-auto">
              <div className="p-6">
                <p className="text-red-600 font-semibold mb-4">حدث خطأ في تحميل بيانات الأطباء</p>
                <p className="text-muted-foreground mb-6">{error.message}</p>
                <Button
                  onClick={() => refetch()}
                  className="btn-elegant"
                >
                  حاول مرة أخرى
                </Button>
              </div>
            </Card>
          </div>
        ) : !doctors || doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">لا توجد بيانات أطباء متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors?.map((doctor: any) => (
              <Card key={doctor.id} className="card-elegant overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Specialization Header */}
                <div className={`bg-gradient-to-r ${getSpecializationColor(doctor.specialization)} p-6 text-center`}>
                  <div className="text-5xl mb-2">{getSpecializationIcon(doctor.specialization)}</div>
                  <p className="text-sm font-medium text-slate-600">{doctor.specialization}</p>
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-700 mb-1">{doctor.name}</h2>
                  <p className="text-sm text-slate-500 mb-4">دكتور متخصص</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-slate-600 mr-2">(4.5)</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{doctor.phone || '+966 XX XXX XXXX'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>العيادة الرئيسية</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    طبيب أسنان متخصص في {doctor.specialization} بخبرة تزيد عن 5 سنوات في مجال طب الأسنان الحديث.
                  </p>

                  {/* Book Button */}
                  <Button
                    onClick={() => navigate('/booking')}
                    className="w-full btn-elegant"
                  >
                    احجز موعداً الآن
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-8"
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}
