import { Link } from 'react-router-dom';
import { ArrowRight, Car, HelpCircle, PhoneCall } from 'lucide-react';
import SEO from '../components/common/SEO';
import ServicesSection from '../components/home/ServicesSection';
import HyderabadLocations from '../components/home/HyderabadLocations';

export default function Services() {
  return (
    <div className="pt-8 bg-white min-h-screen">
      <SEO
        title="Car Rental Services in Hyderabad | Doorstep Delivery & Airport Pickup"
        description="Explore premium self-drive car rental services in Hyderabad with SL Rentals. Doorstep car delivery, RGIA Airport pickup & drop, outstation trips, and 24/7 roadside assistance."
        canonical="/services"
        keywords="car rental services hyderabad, self drive car delivery hyderabad, airport car rental shamshabad, outstation self drive hyderabad, unlimited km car rental hyderabad"
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold text-sm rounded-full mb-4">
            Hyderabad Mobility Solutions
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-secondary mb-4 tracking-tight">
            Self Drive Car Rental Services in Hyderabad
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            From daily city commutes and corporate travel to family vacations and outstation road trips, SL Self Drive Car Rentals offers sanitized, well-maintained vehicles with zero hidden charges and doorstep delivery across Hyderabad.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              to="/fleet"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-primary-hover transition-colors shadow-md shadow-primary/20"
            >
              <Car size={18} />
              Explore Car Fleet
              <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+918106698859"
              className="inline-flex items-center gap-2 bg-white text-secondary font-bold px-6 py-3.5 rounded-xl border border-gray-200 hover:border-primary hover:text-primary transition-colors shadow-sm"
            >
              <PhoneCall size={18} />
              Call +91 8106698859
            </a>
          </div>
        </div>
      </section>

      {/* Core Services Cards */}
      <ServicesSection />

      {/* Hyderabad Coverage Locations */}
      <HyderabadLocations />

      {/* Internal Linking & Next Steps CTA */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to Book Your Self-Drive Car?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base md:text-lg">
            Choose from our extensive fleet of hatchbacks, sedans, compact SUVs, and 7-seater vehicles. Instant booking confirmation with minimal security deposit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/fleet"
              className="bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-primary-hover transition-colors shadow-lg"
            >
              Browse Available Cars
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <HelpCircle size={18} />
              Frequently Asked Questions
            </Link>
            <Link
              to="/terms"
              className="inline-flex items-center gap-2 bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
            >
              Rental Policies & Terms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

