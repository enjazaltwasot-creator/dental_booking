import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ChevronRight, Check } from 'lucide-react';

export default function BookingForm() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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

  const styles = {
    headerBg: { background: 'linear-gradient(to right, #1e3a8a, #1e40af)' },
    containerBg: { backgroundColor: '#f8fafc' },
    cardBg: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
    primaryBtn: { backgroundColor: '#2563eb', color: 'white' },
    orangeBtn: { backgroundColor: '#ff6600', color: 'white' },
    stepActive: { backgroundColor: '#2563eb', color: 'white' },
    stepInactive: { backgroundColor: '#e2e8f0', color: '#64748b' },
    inputBorder: { borderColor: '#cbd5e1' },
    labelText: { color: '#1e3a8a' },
    blueText: { color: '#2563eb' },
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
            <h1 className="text-xl font-bold text-white">احجز موعدك</h1>
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

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all"
                style={step >= s ? styles.stepActive : styles.stepInactive}
              >
                {step > s ? <Check className="w-6 h-6" /> : s}
              </div>
              <span className="text-xs text-center" style={styles.labelText}>
                {['الخدمة', 'الطبيب', 'الموعد', 'البيانات'][s - 1]}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="rounded-2xl p-8 shadow-lg" style={styles.cardBg}>
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold mb-6" style={styles.blueText}>
                اختر الخدمة
              </h2>
              <div className="space-y-3">
                {services?.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setFormData({ ...formData, serviceId: service.id.toString() });
                      handleNext();
                    }}
                    className="w-full p-4 rounded-lg border-2 text-right font-semibold transition-all hover:shadow-md"
                    style={{
                      borderColor: formData.serviceId === service.id.toString() ? '#2563eb' : '#e2e8f0',
                      backgroundColor: formData.serviceId === service.id.toString() ? '#dbeafe' : '#ffffff',
                      color: '#1e3a8a',
                    }}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Doctor Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-6" style={styles.blueText}>
                اختر الطبيب
              </h2>
              <div className="space-y-3">
                {doctors?.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => {
                      setFormData({ ...formData, doctorId: doctor.id.toString() });
                      handleNext();
                    }}
                    className="w-full p-4 rounded-lg border-2 text-right transition-all hover:shadow-md"
                    style={{
                      borderColor: formData.doctorId === doctor.id.toString() ? '#2563eb' : '#e2e8f0',
                      backgroundColor: formData.doctorId === doctor.id.toString() ? '#dbeafe' : '#ffffff',
                    }}
                  >
                    <div className="font-semibold" style={styles.labelText}>
                      {doctor.name}
                    </div>
                    <div className="text-sm" style={{ color: '#64748b' }}>
                      {doctor.specialization}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date and Time Selection */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold mb-6" style={styles.blueText}>
                اختر الموعد والوقت
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2" style={styles.labelText}>
                    التاريخ
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-0 py-2 font-semibold outline-none focus:outline-none bg-transparent"
                    style={{ borderBottom: '1px solid #cbd5e1', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
                  />
                </div>
                {availableSlots && availableSlots.length > 0 && (
                  <div>
                    <label className="block font-semibold mb-2" style={styles.labelText}>
                      الوقت
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setFormData({ ...formData, time: slot })}
                          className="p-2 rounded-lg border-2 font-semibold transition-all"
                          style={{
                            borderColor: formData.time === slot ? '#2563eb' : '#e2e8f0',
                            backgroundColor: formData.time === slot ? '#2563eb' : '#ffffff',
                            color: formData.time === slot ? '#ffffff' : '#1e3a8a',
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Patient Details */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold mb-6" style={styles.blueText}>
                بيانات المريض
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2" style={styles.labelText}>
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-0 py-2 font-semibold outline-none focus:outline-none bg-transparent"
                    style={{ borderBottom: '1px solid #cbd5e1', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2" style={styles.labelText}>
                    رقم الجوال
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="أدخل رقم جوالك"
                    className="w-full px-0 py-2 font-semibold outline-none focus:outline-none bg-transparent"
                    style={{ borderBottom: '1px solid #cbd5e1', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 justify-between">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              style={{
                backgroundColor: step === 1 ? '#e2e8f0' : '#f1f5f9',
                color: '#64748b',
                border: '2px solid #e2e8f0',
              }}
            >
              السابق
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!formData[['serviceId', 'doctorId', 'date'][step - 1]]}
                className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                style={styles.primaryBtn}
              >
                التالي
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone}
                className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                style={styles.orangeBtn}
              >
                تأكيد الحجز
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
