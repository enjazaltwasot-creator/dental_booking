import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

type Step = 'service' | 'dentist' | 'datetime' | 'patient';

export default function BookingForm() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDentist, setSelectedDentist] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  // Queries
  const { data: services, isLoading: servicesLoading } = trpc.services.list.useQuery();
  const { data: dentists, isLoading: dentistsLoading } = trpc.dentists.list.useQuery();
  const { data: bookedSlots } = trpc.bookings.getByDentistAndDate.useQuery(
    { dentistId: selectedDentist || 0, appointmentDate: selectedDate || new Date().toISOString() },
    { enabled: selectedDentist !== null && selectedDate !== '' }
  );
  const { data: workingHours } = trpc.workingHours.getByDentistAndDay.useQuery(
    { dentistId: selectedDentist || 0, dayOfWeek: selectedDate ? new Date(selectedDate).getDay() : 0 },
    { enabled: selectedDentist !== null && selectedDate !== '' }
  );

  // Create booking mutation
  const createBookingMutation = trpc.bookings.create.useMutation({
    onSuccess: (booking) => {
      toast.success('تم إنشاء الحجز بنجاح!');
      navigate(`/confirmation/${booking.referenceNumber}`);
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  // Generate available time slots
  const availableTimeSlots = useMemo(() => {
    if (!workingHours || workingHours.length === 0) return [];
    
    const slots: string[] = [];
    const workingHour = workingHours[0];
    if (!workingHour) return [];

    const [startHour, startMin] = workingHour.startTime.split(':').map(Number);
    const [endHour, endMin] = workingHour.endTime.split(':').map(Number);

    let current = new Date();
    current.setHours(startHour, startMin, 0);
    const end = new Date();
    end.setHours(endHour, endMin, 0);

    const bookedTimes = (bookedSlots || []).map(b => b.appointmentTime);

    while (current < end) {
      const timeStr = current.toTimeString().slice(0, 5);
      if (!bookedTimes.includes(timeStr)) {
        slots.push(timeStr);
      }
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  }, [workingHours, bookedSlots]);

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 'service':
        return selectedService !== null;
      case 'dentist':
        return selectedDentist !== null;
      case 'datetime':
        return selectedDate !== '' && selectedTime !== '';
      case 'patient':
        return patientName.trim() !== '' && patientPhone.trim() !== '';
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDentist || !selectedDate || !selectedTime) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    createBookingMutation.mutate({
      dentistId: selectedDentist,
      serviceId: selectedService,
      patientName,
      patientPhone,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
    });
  };

  return (
    <div className="min-h-screen gradient-calming py-12">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">احجز موعدك</h1>
            <p className="text-muted-foreground">اتبع الخطوات التالية لحجز موعد مع طبيب الأسنان</p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8 flex justify-between items-center">
            {(['service', 'dentist', 'datetime', 'patient'] as Step[]).map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep === step
                      ? 'bg-accent text-white'
                      : ['service', 'dentist', 'datetime', 'patient'].indexOf(currentStep) > idx
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      ['service', 'dentist', 'datetime', 'patient'].indexOf(currentStep) > idx
                        ? 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form content */}
          <Card className="card-elegant">
            {/* Step 1: Service Selection */}
            {currentStep === 'service' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">اختر الخدمة</h2>
                {servicesLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {services?.map(service => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedService === service.id
                            ? 'border-accent bg-accent/10'
                            : 'border-muted hover:border-accent/50'
                        }`}
                      >
                        <div className="font-semibold">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.description}</div>
                        <div className="text-xs text-muted-foreground mt-2">المدة: {service.duration} دقيقة</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Dentist Selection */}
            {currentStep === 'dentist' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">اختر طبيب الأسنان</h2>
                {dentistsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {dentists?.map(dentist => (
                      <button
                        key={dentist.id}
                        onClick={() => setSelectedDentist(dentist.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedDentist === dentist.id
                            ? 'border-accent bg-accent/10'
                            : 'border-muted hover:border-accent/50'
                        }`}
                      >
                        <div className="font-semibold">{dentist.name}</div>
                        <div className="text-sm text-muted-foreground">{dentist.specialization}</div>
                        {dentist.bio && <div className="text-xs text-muted-foreground mt-2">{dentist.bio}</div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Date and Time Selection */}
            {currentStep === 'datetime' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">اختر التاريخ والوقت</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date" className="block mb-2">التاريخ</Label>
                    <Input
                      id="date"
                      type="date"
                      min={minDate}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime('');
                      }}
                      className="input-elegant"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <Label htmlFor="time" className="block mb-2">الوقت</Label>
                      {availableTimeSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableTimeSlots.map(time => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-2 rounded-lg border-2 transition-all ${
                                selectedTime === time
                                  ? 'border-accent bg-accent/10'
                                  : 'border-muted hover:border-accent/50'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          لا توجد مواعيد متاحة في هذا التاريخ
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Patient Information */}
            {currentStep === 'patient' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">بيانات المريض</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="block mb-2">الاسم الكامل</Label>
                    <Input
                      id="name"
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="input-elegant"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block mb-2">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="أدخل رقم هاتفك"
                      className="input-elegant"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-muted">
              <Button
                onClick={() => {
                  const steps: Step[] = ['service', 'dentist', 'datetime', 'patient'];
                  const currentIdx = steps.indexOf(currentStep);
                  if (currentIdx > 0) {
                    setCurrentStep(steps[currentIdx - 1]);
                  }
                }}
                disabled={currentStep === 'service'}
                variant="outline"
              >
                السابق
              </Button>

              {currentStep !== 'patient' ? (
                <Button
                  onClick={() => {
                    const steps: Step[] = ['service', 'dentist', 'datetime', 'patient'];
                    const currentIdx = steps.indexOf(currentStep);
                    if (canProceedToNextStep() && currentIdx < steps.length - 1) {
                      setCurrentStep(steps[currentIdx + 1]);
                    } else if (!canProceedToNextStep()) {
                      toast.error('يرجى ملء جميع الحقول المطلوبة');
                    }
                  }}
                  disabled={!canProceedToNextStep()}
                >
                  التالي
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceedToNextStep() || createBookingMutation.isPending}
                  className="btn-elegant"
                >
                  {createBookingMutation.isPending ? 'جاري الحجز...' : 'تأكيد الحجز'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
