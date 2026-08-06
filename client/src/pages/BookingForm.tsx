import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function BookingForm() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    branch: '',
    department: '',
    serviceId: '',
    doctorId: '',
    date: '',
    time: '',
    name: '',
    phone: '',
  });

  const { data: services } = trpc.booking.getServices.useQuery();
  const { data: doctors } = trpc.booking.getDoctors.useQuery();
  const { data: availableSlots } = trpc.booking.getAvailableSlots.useQuery(
    { doctorId: parseInt(formData.doctorId) || 0, date: formData.date },
    { enabled: !!formData.doctorId && !!formData.date }
  );

  const createBooking = trpc.booking.createBooking.useMutation({
    onSuccess: (data) => {
      navigate(`/confirmation/${data.id}`);
    },
  });

  const branches = ['الفرع الرئيسي', 'فرع الشرق', 'فرع الغرب'];
  const departments = ['قسم الأسنان', 'قسم الجلدية', 'قسم الليزر'];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    createBooking.mutate({
      serviceId: parseInt(formData.serviceId),
      doctorId: parseInt(formData.doctorId),
      date: formData.date,
      time: formData.time,
      patientName: formData.name,
      patientPhone: formData.phone,
    });
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

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition ${
                  step >= s
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              <span className="text-xs text-center text-slate-600 font-semibold">
                {['الفرع', 'الخدمة', 'الموعد', 'البيانات'][s - 1]}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Step 1: Branch & Department */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">اختر الفرع والقسم</h2>
              
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
            </div>
          )}

          {/* Step 2: Service Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">اختر الخدمة</h2>
              <div className="space-y-3">
                {services?.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setFormData({ ...formData, serviceId: service.id.toString() });
                      handleNext();
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-right font-semibold transition ${
                      formData.serviceId === service.id.toString()
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-slate-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Doctor Selection */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">اختر الطبيب</h2>
              <div className="space-y-3">
                {doctors?.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => {
                      setFormData({ ...formData, doctorId: doctor.id.toString() });
                      handleNext();
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-right transition ${
                      formData.doctorId === doctor.id.toString()
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-slate-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{doctor.name}</div>
                    <div className="text-sm text-slate-600">{doctor.specialization}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Date, Time & Patient Details */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">أكمل البيانات</h2>
              
              <div>
                <label className="block text-right font-semibold text-slate-900 mb-2">التاريخ</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border-b-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold text-right"
                />
              </div>

              {availableSlots && availableSlots.length > 0 && (
                <div>
                  <label className="block text-right font-semibold text-slate-900 mb-2">الوقت</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setFormData({ ...formData, time: slot })}
                        className={`p-2 rounded-lg border-2 font-semibold transition ${
                          formData.time === slot
                            ? 'border-sky-600 bg-sky-600 text-white'
                            : 'border-slate-200 bg-white text-slate-900 hover:border-sky-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-right font-semibold text-slate-900 mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full px-4 py-2 border-b-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold text-right"
                />
              </div>

              <div>
                <label className="block text-right font-semibold text-slate-900 mb-2">رقم الجوال</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="أدخل رقم جوالك"
                  className="w-full px-4 py-2 border-b-2 border-slate-200 focus:border-sky-600 focus:outline-none font-semibold text-right"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 justify-between">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 border-2 border-slate-200 text-slate-700 hover:border-slate-300"
            >
              السابق
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!formData[['branch', 'serviceId', 'doctorId'][step - 1]]}
                className="px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 bg-sky-600 hover:bg-sky-700 text-white"
              >
                التالي
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone}
                className="px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 bg-orange-500 hover:bg-orange-600 text-white"
              >
                إرسال
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
