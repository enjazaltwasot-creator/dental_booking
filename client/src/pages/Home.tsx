import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { Smile, Users, Clock, Award } from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-calming py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ابتسامة صحية، حياة أفضل
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              احجز موعدك مع أفضل أطباء الأسنان المتخصصين. نحن هنا لنعتني بصحة أسنانك بكل عناية واحترافية.
            </p>
            <Button
              onClick={() => navigate('/booking')}
              className="btn-elegant text-lg px-8 py-6"
            >
              احجز موعدك الآن
            </Button>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 md:py-24 bg-card/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">أطباؤنا المتخصصون</h2>
            <p className="text-lg text-muted-foreground mb-8">فريق من أفضل أطباء الأسنان المتخصصين</p>
            <Button
              onClick={() => navigate('/doctors')}
              variant="outline"
              className="px-8 py-2"
            >
              عرض جميع الأطباء
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">خدماتنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Smile,
                title: 'تنظيف الأسنان',
                description: 'تنظيف احترافي وآمن للأسنان واللثة',
              },
              {
                icon: Award,
                title: 'حشو الأسنان',
                description: 'حشو متقدم بأحدث المواد الطبية',
              },
              {
                icon: Users,
                title: 'تقويم الأسنان',
                description: 'تقويم شامل للأسنان والعضة',
              },
              {
                icon: Clock,
                title: 'تبييض الأسنان',
                description: 'تبييض احترافي وآمن للأسنان',
              },
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <Card key={idx} className="card-elegant text-center p-8">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-accent" />
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">لماذا تختارنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'أطباء متخصصون',
                description: 'فريق من أفضل أطباء الأسنان المتخصصين بخبرات عملية طويلة',
              },
              {
                title: 'تقنيات حديثة',
                description: 'نستخدم أحدث التقنيات والمعدات الطبية المتقدمة',
              },
              {
                title: 'رعاية شاملة',
                description: 'نقدم رعاية شاملة وآمنة مع الاهتمام براحتك',
              },
            ].map((reason, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-accent rounded-full" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-calming py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">جاهز لابتسامة أفضل؟</h2>
            <p className="text-lg text-muted-foreground mb-8">
              احجز موعدك الآن واستمتع بخدمة طبية متميزة وآمنة
            </p>
            <Button
              onClick={() => navigate('/booking')}
              className="btn-elegant text-lg px-8 py-6"
            >
              احجز موعدك الآن
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 py-8 border-t border-muted">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2024 عيادة الأسنان المتقدمة. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
