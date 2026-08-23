import { UserCheck, MapPin, Briefcase } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: UserCheck,
      title: 'Drivers Available',
      description: 'Professional, verified chauffeurs and driver support on demand for a stress-free journey.'
    },
    {
      icon: MapPin,
      title: 'Pick-up & Drop',
      description: 'Doorstep vehicle delivery and collection at airport or home locations for your convenience.'
    },
    {
      icon: MapPin,
      title: 'Rent a Car with Driver',
      description: 'Flexible custom tour packages with experienced drivers for sightseeing and outstation trips.'
    },
    {
      icon: Briefcase,
      title: 'Car Leasing & Rentals',
      description: 'Corporate short-term and long-term vehicle leasing options tailored for businesses.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary">What We Offer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-slate-50 rounded-3xl p-8 hover:shadow-xl hover:bg-white transition-all duration-300 border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <service.icon size={28} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
