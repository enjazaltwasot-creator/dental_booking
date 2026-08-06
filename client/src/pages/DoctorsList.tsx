import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Phone, MapPin, Star } from 'lucide-react';

export default function DoctorsList() {
  const [, navigate] = useLocation();
  const { data: doctors, isLoading } = trpc.booking.getDoctors.useQuery();

  const styles = {
    headerBg: { background: 'linear-gradient(to right, #1e3a8a, #1e40af)' },
    containerBg: { backgroundColor: '#f8fafc' },
    cardBg: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
    blueText: { color: '#2563eb' },
    darkBlueText: { color: '#1e3a8a' },
    orangeBtn: { backgroundColor: '#ff6600', color: 'white' },
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
            <h1 className="text-xl font-bold text-white">أطباؤنا المتخصصون</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={styles.orangeBtn}
          >
            العودة للرئيسية
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4" style={styles.blueText}>
            فريقنا الطبي
          </h2>
          <p className="text-xl" style={{ color: '#64748b' }}>
            أطباء متخصصون بخبرة عالية وكفاءة مثبتة
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p style={styles.blueText} className="text-lg font-semibold">جاري التحميل...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors?.map((doctor) => (
              <div
                key={doctor.id}
                className="rounded-2xl p-6 border-2 shadow-md hover:shadow-xl transition-all"
                style={styles.cardBg}
              >
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3" style={{ backgroundColor: '#2563eb' }}>
                    {doctor.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold" style={styles.darkBlueText}>
                    {doctor.name}
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: '#ff6600' }}>
                    {doctor.specialization}
                  </p>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b-2" style={{ borderColor: '#e2e8f0' }}>
                  <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{doctor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        style={{
                          fill: i < 4 ? '#ff6600' : '#e2e8f0',
                          color: i < 4 ? '#ff6600' : '#e2e8f0',
                        }}
                      />
                    ))}
                    <span className="text-xs font-semibold" style={{ color: '#64748b' }}>
                      (4.5)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/booking')}
                  className="w-full py-3 rounded-lg font-bold transition-all hover:opacity-90"
                  style={styles.orangeBtn}
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
