import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function DoctorsList() {
  const [, navigate] = useLocation();
  const { data: doctors, isLoading } = trpc.booking.getDoctors.useQuery();

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img 
            src="/manus-storage/evan-clinic-logo_3b9cca8a.webp" 
            alt="Evan Clinic" 
            className="h-12 w-auto"
          />
          <h1 className="text-2xl font-bold text-slate-900">أطباؤنا المتخصصون</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            العودة للرئيسية
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">فريقنا الطبي</h2>
          <p className="text-lg text-slate-600">أطباء متخصصون بخبرة عالية وكفاءة مثبتة</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600 font-semibold">جاري التحميل...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors?.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl p-6 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-2xl font-bold text-sky-600 mb-4 mx-auto">
                  {doctor.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 text-center mb-1">
                  {doctor.name}
                </h3>
                <p className="text-sm font-semibold text-sky-600 text-center mb-4">
                  {doctor.specialization}
                </p>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <i className="fas fa-phone text-sky-600"></i>
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <i className="fas fa-map-marker-alt text-sky-600"></i>
                    <span className="text-sm">{doctor.location}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${
                          i < 4 ? 'text-yellow-400' : 'text-slate-200'
                        }`}
                      ></i>
                    ))}
                    <span className="text-xs font-semibold text-slate-600 mr-2">(4.5)</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/booking')}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-bold transition"
                >
                  احجز موعد
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
