import { useLocation } from 'wouter';
import { ArrowLeft, Phone, MapPin, Clock } from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();

  const styles = {
    headerBg: { background: 'linear-gradient(to right, #1e3a8a, #1e40af)' },
    heroBg: { background: 'linear-gradient(to bottom, #dbeafe, #e0f2fe, #ffffff)' },
    ctaBg: { background: 'linear-gradient(to right, #2563eb, #1d4ed8, #1e3a8a)' },
    blueText: { color: '#2563eb' },
    orangeBtn: { backgroundColor: '#ff6600', color: 'white' },
    darkBlueText: { color: '#1e3a8a' },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 shadow-lg" style={styles.headerBg}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/manus-storage/evan-clinic-logo_3b9cca8a.webp" 
              alt="Evan Clinic Logo" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-white">إيفان</h1>
              <p className="text-xs font-semibold" style={{ color: '#ffb84d' }}>عيادات طبية</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-blue-100 hover:text-orange-300 transition-colors">الخدمات</a>
            <a href="#branches" className="text-sm font-medium text-blue-100 hover:text-orange-300 transition-colors">الفروع</a>
            <button
              onClick={() => navigate('/admin-login')}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-md hover:opacity-90"
              style={styles.orangeBtn}
            >
              لوحة التحكم
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden" style={styles.heroBg}>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-sm" style={{ backgroundColor: '#bfdbfe', color: '#1e3a8a' }}>
                مجمع إيفان الطبي
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={styles.blueText}>
                ابتسامة صحية، حياة أفضل
              </h2>
              <p className="text-lg mb-8 leading-relaxed font-medium" style={{ color: '#374151' }}>
                نقدم أفضل الخدمات في طب الأسنان والجلدية والليزر الحديث تحت إشراف نخبة من الأطباء ذوي الخبرة والكفاءة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/booking')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white rounded-lg font-bold transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl text-lg"
                  style={{ backgroundColor: '#2563eb' }}
                >
                  احجز موعدك الآن
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/doctors')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold border-3 transition-all duration-200 shadow-md text-lg"
                  style={{ backgroundColor: '#ffffff', color: '#ff6600', borderColor: '#ff6600' }}
                >
                  تعرف على الأطباء
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl p-10 text-white shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #2563eb, #1e3a8a)' }}>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                      <Clock className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">حجز سهل وسريع</p>
                      <p className="text-blue-100 text-sm">احجز موعدك في دقائق معدودة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                      <Phone className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">فريق متخصص</p>
                      <p className="text-blue-100 text-sm">أطباء معتمدون وذوو خبرة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">ثلاث فروع</p>
                      <p className="text-blue-100 text-sm">في مواقع استراتيجية بالرياض</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24" style={{ background: 'linear-gradient(to bottom, #f8fafc, #ffffff)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold mb-4" style={styles.blueText}>خدماتنا</h3>
            <p className="text-xl font-medium" style={{ color: '#374151' }}>رعاية شاملة لصحتك وجمالك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'طب الأسنان', desc: 'تنظيف وحشو وتقويم وزراعة', icon: '🦷', bgColor: '#dbeafe' },
              { title: 'الجلدية والتجميل', desc: 'فيلر وبوتوكس وتقشير', icon: '✨', bgColor: '#fed7aa' },
              { title: 'الليزر الحديث', desc: 'إزالة الشعر والعلاجات الجلدية', icon: '💡', bgColor: '#dcfce7' },
            ].map((service) => (
              <div key={service.title} className="rounded-2xl p-8 border-2 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl" style={{ backgroundColor: service.bgColor, borderColor: '#93c5fd' }}>
                <div className="text-5xl mb-4">{service.icon}</div>
                <h4 className="text-2xl font-bold mb-3" style={styles.darkBlueText}>{service.title}</h4>
                <p className="font-medium" style={{ color: '#374151' }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="py-24" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold mb-4" style={styles.blueText}>فروعنا</h3>
            <p className="text-xl font-medium" style={{ color: '#374151' }}>اختر الفرع الأقرب إليك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'فرع حي العليا', phone: '0503164646', desc: 'وسط الرياض' },
              { name: 'فرع حي الأحمدية', phone: '0533759908', desc: 'حي لبن' },
              { name: 'فرع حي المهدية', phone: '05093255298', desc: 'غرب الرياض' },
            ].map((branch) => (
              <div key={branch.name} className="rounded-2xl p-8 border-2 transition-all duration-300 shadow-md hover:shadow-xl" style={{ backgroundColor: '#dbeafe', borderColor: '#93c5fd' }}>
                <h4 className="text-2xl font-bold mb-3" style={styles.darkBlueText}>{branch.name}</h4>
                <p className="text-sm mb-6 font-medium" style={{ color: '#374151' }}>{branch.desc}</p>
                <a
                  href={`https://wa.me/966${branch.phone.replace(/^0/, '')}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  <Phone className="w-5 h-5" />
                  {branch.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={styles.ctaBg}>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h3 className="text-5xl font-bold text-white mb-6">جاهز لتحسين ابتسامتك؟</h3>
          <p className="text-xl mb-10 font-medium" style={{ color: '#bfdbfe' }}>احجز موعدك الآن مع أفضل الأطباء في مجمع إيفان الطبي</p>
          <button
            onClick={() => navigate('/booking')}
            className="inline-flex items-center justify-center gap-2 px-10 py-5 text-white rounded-xl font-bold transition-all duration-200 active:scale-95 shadow-xl hover:shadow-2xl text-lg"
            style={styles.orangeBtn}
          >
            احجز الآن
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: '#1e3a8a', borderTop: '4px solid #ff6600' }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-medium text-blue-100">&copy; 2026 مجمع إيفان الطبي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
