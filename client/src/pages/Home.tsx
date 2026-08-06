import { useLocation } from 'wouter';
import { ArrowLeft, Phone, MapPin, Clock } from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-blue-900 border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">إيفان</h1>
              <p className="text-xs text-orange-400 font-semibold">عيادات طبية</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">الخدمات</a>
            <a href="#branches" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">الفروع</a>
            <button
              onClick={() => navigate('/admin-login')}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              لوحة التحكم
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-100 to-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                مجمع إيفان الطبي
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-blue-600 leading-tight mb-6">
                ابتسامة صحية، حياة أفضل
              </h2>
              <p className="text-xl text-slate-700 mb-8 leading-relaxed">
                نقدم أفضل الخدمات في طب الأسنان والجلدية والليزر الحديث تحت إشراف نخبة من الأطباء ذوي الخبرة والكفاءة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/booking')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  احجز موعدك الآن
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/doctors')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-50 text-orange-600 rounded-lg font-semibold border-2 border-orange-600 hover:bg-orange-100 transition-all duration-200"
                >
                  تعرف على الأطباء
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-blue-400/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">حجز سهل وسريع</p>
                      <p className="text-sm text-blue-100">احجز موعدك في دقائق معدودة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">فريق متخصص</p>
                      <p className="text-sm text-blue-100">أطباء معتمدون وذوو خبرة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">ثلاث فروع</p>
                      <p className="text-sm text-blue-100">في مواقع استراتيجية بالرياض</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-blue-600 mb-4">خدماتنا</h3>
            <p className="text-xl text-slate-700">رعاية شاملة لصحتك وجمالك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'طب الأسنان', desc: 'تنظيف وحشو وتقويم وزراعة', icon: '🦷' },
              { title: 'الجلدية والتجميل', desc: 'فيلر وبوتوكس وتقشير', icon: '✨' },
              { title: 'الليزر الحديث', desc: 'إزالة الشعر والعلاجات الجلدية', icon: '💡' },
            ].map((service) => (
              <div key={service.title} className="bg-white rounded-lg p-8 border-2 border-blue-200 hover:border-blue-600 hover:shadow-lg transition-all duration-200">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h4 className="text-xl font-bold text-blue-900 mb-3">{service.title}</h4>
                <p className="text-slate-700">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-blue-600 mb-4">فروعنا</h3>
            <p className="text-xl text-slate-700">اختر الفرع الأقرب إليك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'فرع حي العليا', phone: '0503164646', desc: 'وسط الرياض' },
              { name: 'فرع حي الأحمدية', phone: '0533759908', desc: 'حي لبن' },
              { name: 'فرع حي المهدية', phone: '05093255298', desc: 'غرب الرياض' },
            ].map((branch) => (
              <div key={branch.name} className="bg-blue-50 rounded-lg p-8 border-2 border-blue-200 hover:shadow-lg transition-all duration-200">
                <h4 className="text-xl font-bold text-blue-900 mb-2">{branch.name}</h4>
                <p className="text-sm text-slate-600 mb-4">{branch.desc}</p>
                <a
                  href={`https://wa.me/966${branch.phone.replace(/^0/, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {branch.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">جاهز لتحسين ابتسامتك؟</h3>
          <p className="text-xl text-blue-100 mb-8">احجز موعدك الآن مع أفضل الأطباء في مجمع إيفان الطبي</p>
          <button
            onClick={() => navigate('/booking')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
          >
            احجز الآن
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 py-8 border-t-4 border-orange-600">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 مجمع إيفان الطبي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
