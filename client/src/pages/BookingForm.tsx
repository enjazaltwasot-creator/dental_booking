import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function BookingForm() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: '',
    department: '',
    service: '',
  });

  const branches = ['الفرع الرئيسي', 'فرع الشرق', 'فرع الغرب'];
  const departments = ['قسم الأسنان', 'قسم الجلدية', 'قسم الليزر'];
  const services = ['تنظيف الأسنان', 'تبييض الأسنان', 'حشو الأسنان', 'تقويم الأسنان'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Submit to API
  };

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
          <h1 className="text-2xl font-bold text-slate-900">احجز موعدك</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            العودة للرئيسية
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-100 via-white to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              اختر الصحيح تجده معنا ..
            </h2>
            <p className="text-lg text-slate-600">
              سجل موعدك الآن
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
            {/* Name */}
            <div>
              <label className="block text-right font-semibold text-slate-900 mb-2">
                الاسم
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل اسمك الكامل"
                className="w-full px-4 py-3 border-b-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold text-right"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-right font-semibold text-slate-900 mb-2">
                رقم الجوال
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="أدخل رقم جوالك"
                className="w-full px-4 py-3 border-b-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold text-right"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-right font-semibold text-slate-900 mb-2">
                الفرع الأقرب لك
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-4 py-3 border-b-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold text-right bg-white"
              >
                <option value="">اختر الفرع</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-right font-semibold text-slate-900 mb-2">
                اختر القسم
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 border-b-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold text-right bg-white"
              >
                <option value="">اختر القسم</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block text-right font-semibold text-slate-900 mb-2">
                اختر الخدمة
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 border-b-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold text-right bg-white"
              >
                <option value="">اختر الخدمة</option>
                {services.map((svc) => (
                  <option key={svc} value={svc}>
                    {svc}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold text-lg transition"
              >
                إرسال
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
