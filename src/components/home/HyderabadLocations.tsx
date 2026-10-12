import { MapPin, Navigation, Car, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HyderabadLocations() {
  const locations = [
    {
      name: 'Rajiv Gandhi Int. Airport (RGIA)',
      area: 'Shamshabad, Hyderabad',
      highlight: '24/7 Airport Pick-up & Drop',
      desc: 'Instant self drive car delivery right at RGIA terminal arrivals for travelers & business visits.'
    },
    {
      name: 'HITEC City & Madhapur',
      area: 'Cyberabad IT Corridor',
      highlight: 'Tech Hub Fast Delivery',
      desc: 'Ideal for IT professionals and weekend road trips with doorstep delivery across Mindspace & Cyber Towers.'
    },
    {
      name: 'Gachibowli & Financial Dist.',
      area: 'West Hyderabad',
      highlight: 'Daily & Corporate Rentals',
      desc: 'Seamless car leasing and self drive rentals near major corporate campuses, Waverock & Kokapet.'
    },
    {
      name: 'Secunderabad Railway Station',
      area: 'Twin Cities Junction',
      highlight: 'Train Arrival Convenience',
      desc: 'Pick up your sanitized rental car right outside the station or have it delivered to your hotel.'
    },
    {
      name: 'Kukatpally, KPHB & Miyapur',
      area: 'North-West Hyderabad',
      highlight: 'Family & City Cruising',
      desc: 'Budget-friendly hatchbacks & 7-seater MUVs available for local family visits and shopping trips.'
    },
    {
      name: 'Nagaram, ECIL & Keesara',
      area: 'East Hyderabad Head Office',
      highlight: 'Local Pickup Hub',
      desc: 'Our primary fleet yard with instant documentation, fastest handover, and walk-in availability.'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-primary font-bold tracking-wider uppercase text-xs sm:text-sm mb-2 block">
            Hyderabad Citywide Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary tracking-tight mb-3">
            Popular Self Drive Car Rental Locations in Hyderabad
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Wherever you are in the City of Pearls, SL Self Drive Car Rentals delivers top-conditioned vehicles directly to your doorstep, airport, or hotel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-primary bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                    {loc.highlight}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-secondary mb-1 group-hover:text-primary transition-colors">
                  {loc.name}
                </h3>
                <p className="text-xs font-semibold text-gray-500 mb-2.5 flex items-center gap-1">
                  <Navigation size={12} className="text-gray-400" /> {loc.area}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {loc.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <Clock size={13} className="text-green-600" /> Fast Delivery
                </span>
                <Link
                  to="/fleet"
                  className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 hover:underline"
                >
                  Book for this Area →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2 font-bold">
              <Shield size={22} />
            </div>
            <h4 className="font-bold text-secondary text-sm">Verified DL & Aadhaar Only</h4>
            <p className="text-xs text-gray-500 mt-0.5">100% paperless & secure KYC verification</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2 font-bold">
              <Car size={22} />
            </div>
            <h4 className="font-bold text-secondary text-sm">Sanitized & Inspected Cars</h4>
            <p className="text-xs text-gray-500 mt-0.5">Every vehicle is cleaned & serviced before handover</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-2 font-bold">
              <Clock size={22} />
            </div>
            <h4 className="font-bold text-secondary text-sm">24/7 Roadside Assistance</h4>
            <p className="text-xs text-gray-500 mt-0.5">Dedicated breakdown support anywhere in Telangana</p>
          </div>
        </div>
      </div>
    </section>
  );
}
