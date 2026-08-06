import { useLocation } from 'wouter';
import { ArrowRight, Users, Calendar, Award } from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              D
            </div>
            <h1 className="text-xl font-bold text-slate-900">DentBook</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Services</a>
            <a href="#doctors" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Doctors</a>
            <button
              onClick={() => navigate('/admin-login')}
              className="px-4 py-2 text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Your Smile, Our Priority
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Book your dental appointment in seconds. Professional care, modern facilities, and a team dedicated to your oral health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/booking')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Book Appointment
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/doctors')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-cyan-50 text-cyan-700 rounded-lg font-semibold border border-cyan-200 hover:bg-cyan-100 transition-all duration-200"
              >
                Meet Our Doctors
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Easy Booking</p>
                    <p className="text-sm text-white/80">Schedule in 2 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Expert Team</p>
                    <p className="text-sm text-white/80">Certified professionals</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Quality Care</p>
                    <p className="text-sm text-white/80">Latest technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h3>
            <p className="text-xl text-slate-600">Comprehensive dental care for the whole family</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Cleaning', desc: 'Professional teeth cleaning and whitening' },
              { title: 'Filling', desc: 'Cavity treatment with modern materials' },
              { title: 'Orthodontics', desc: 'Braces and alignment solutions' },
            ].map((service) => (
              <div key={service.title} className="bg-slate-50 rounded-lg p-8 border border-slate-200 hover:shadow-lg transition-all duration-200">
                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
                <p className="text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Ready to Schedule Your Visit?</h3>
          <p className="text-xl text-slate-300 mb-8">Join hundreds of satisfied patients who trust us with their smile.</p>
          <button
            onClick={() => navigate('/booking')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Book Your Appointment Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 DentBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
