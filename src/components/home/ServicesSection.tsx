import { UserCheck, MapPin, Briefcase, Car, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServicesSection() {
  const services = [
    {
      icon: Car,
      title: 'Self Drive Car Rentals',
      description: 'Affordable daily, weekly and monthly self drive cars across Hyderabad with unlimited kilometer packages.',
      linkText: 'Browse Fleet',
      linkUrl: '/fleet'
    },
    {
      icon: MapPin,
      title: 'Doorstep Delivery & Airport Drop',
      description: 'Convenient doorstep vehicle delivery and pickup directly at RGIA Hyderabad Airport, railway stations or your home.',
      linkText: 'Check Locations',
      linkUrl: '/contact'
    },
    {
      icon: UserCheck,
      title: 'Chauffeur Driven Cars on Demand',
      description: 'Experienced, police-verified chauffeurs available for outstation family trips, weddings, and executive business travel.',
      linkText: 'Inquire Now',
      linkUrl: '/contact'
    },
    {
      icon: Briefcase,
      title: 'Corporate Car Leasing',
      description: 'Cost-effective short and long-term vehicle leasing plans with full maintenance support for businesses in Cyberabad.',
      linkText: 'Learn More',
      linkUrl: '/services'
    }
  ];

  return (
    <section className="py-20 bg-white" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-wider uppercase text-xs sm:text-sm mb-2 block">
            Car Rental Solutions in Hyderabad
          </span>
          <h2 id="services-heading" className="text-3xl sm:text-4xl font-bold text-secondary tracking-tight">
            Comprehensive Self Drive & Rental Services
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Tailored mobility solutions crafted for local commutes, weekend getaways, and outstation road trips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-slate-50 rounded-3xl p-8 hover:shadow-xl hover:bg-white transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <service.icon size={28} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-6">
                  {service.description}
                </p>
              </div>

              <Link
                to={service.linkUrl}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover pt-4 border-t border-gray-200/60 transition-colors"
              >
                <span>{service.linkText}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
