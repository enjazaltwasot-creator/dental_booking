import { useLocation } from 'wouter';

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <img 
            src="/manus-storage/evan-clinic-logo_3b9cca8a.webp" 
            alt="Evan Clinic" 
            className="h-12 w-auto"
          />
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-700 hover:text-sky-600 font-medium transition">الرئيسية</a>
            <a href="#services" className="text-slate-700 hover:text-sky-600 font-medium transition">خدماتنا</a>
            <a href="#doctors" className="text-slate-700 hover:text-sky-600 font-medium transition">الأطباء</a>
            <a href="#branches" className="text-slate-700 hover:text-sky-600 font-medium transition">الفروع</a>
            <a href="#contact" className="text-slate-700 hover:text-sky-600 font-medium transition">اتصل بنا</a>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/booking')}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
          >
            حجز موعد
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                ابتسامة صحية،<br />حياة أفضل
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                نقدم أفضل الخدمات في مجالات طب الأسنان والجلدية والليزر تحت إشراف نخبة من الأطباء المتخصصين ذوي الخبرة والكفاءة العالية.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/booking')}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                >
                  احجز موعدك الآن
                </button>
                <button
                  onClick={() => navigate('/doctors')}
                  className="border-2 border-sky-600 text-sky-600 hover:bg-sky-50 px-8 py-3 rounded-lg font-semibold transition"
                >
                  تعرف على أطباؤنا
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 md:order-2">
              <div className="bg-gradient-to-br from-sky-200 to-blue-200 rounded-2xl h-96 md:h-full min-h-96 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <i className="fas fa-tooth text-6xl text-sky-600 mb-4"></i>
                  <p className="text-slate-600 font-semibold">مركز طبي متخصص</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">خدماتنا المتخصصة</h2>
            <p className="text-lg text-slate-600">نقدم مجموعة شاملة من الخدمات الطبية بأحدث التقنيات</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fa-tooth', title: 'تنظيف الأسنان', desc: 'تنظيف احترافي وتقويم وزراعة' },
              { icon: 'fa-smile', title: 'تبييض الأسنان', desc: 'تبييض آمن وفعال بأحدث التقنيات' },
              { icon: 'fa-syringe', title: 'حشو الأسنان', desc: 'حشو آمن وسهل للأسنان والعصب' },
              { icon: 'fa-heart', title: 'تقويم الأسنان', desc: 'تقويم حديث وسريع وآمن' },
              { icon: 'fa-spa', title: 'خدمات الجلدية', desc: 'علاجات جلدية متقدمة وآمنة' },
              { icon: 'fa-lightbulb', title: 'تقنيات الليزر', desc: 'ليزر طبي حديث وفعال' },
              { icon: 'fa-microscope', title: 'فحوصات دقيقة', desc: 'فحوصات شاملة ودقيقة جداً' },
              { icon: 'fa-stethoscope', title: 'استشارات طبية', desc: 'استشارات متخصصة ومجانية' },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl text-sky-600 mb-4">
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">فريقنا الطبي</h2>
            <p className="text-lg text-slate-600">أطباء متخصصون بخبرة عالية وكفاءة مثبتة</p>
          </div>

          <button
            onClick={() => navigate('/doctors')}
            className="mx-auto block bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
          >
            عرض جميع الأطباء
          </button>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">فروعنا</h2>
            <p className="text-lg text-slate-600">ثلاث فروع في مواقع استراتيجية بالرياض</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'الفرع الرئيسي', address: 'حي الرياض - شارع العليا' },
              { name: 'فرع الشرق', address: 'حي الشرق - شارع الملك فهد' },
              { name: 'فرع الغرب', address: 'حي الغرب - شارع الملك عبدالعزيز' },
            ].map((branch, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-8 border border-sky-100 text-center"
              >
                <i className="fas fa-map-marker-alt text-3xl text-sky-600 mb-4 block"></i>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{branch.name}</h3>
                <p className="text-slate-600">{branch.address}</p>
                <a
                  href="https://wa.me/966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  تواصل عبر واتس
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-8">تواصل معنا</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <a
              href="tel:+966"
              className="flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <i className="fas fa-phone text-2xl text-sky-600"></i>
              <span className="text-slate-700 font-semibold">اتصل بنا</span>
            </a>
            <a
              href="https://wa.me/966"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <i className="fas fa-whatsapp text-2xl text-green-600"></i>
              <span className="text-slate-700 font-semibold">واتس آب</span>
            </a>
            <a
              href="mailto:info@evanclinic.sa"
              className="flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <i className="fas fa-envelope text-2xl text-sky-600"></i>
              <span className="text-slate-700 font-semibold">البريد الإلكتروني</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">&copy; 2024 مجمع إيفان الطبي. جميع الحقوق محفوظة.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-sky-400 transition">سياسة الخصوصية</a>
            <a href="#" className="hover:text-sky-400 transition">شروط الاستخدام</a>
            <a href="#" className="hover:text-sky-400 transition">اتصل بنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
