import { useFleetStore } from '../store/fleetStore';
import { useAuthStore } from '../store/authStore';
import { Heart, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import AuthModal from '../components/auth/AuthModal';
import BookingModal from '../components/booking/BookingModal';
import EnquiryModal from '../components/booking/EnquiryModal';
import SEO from '../components/common/SEO';
import type { Car } from '../types';

export default function Fleet() {
  const { cars } = useFleetStore();
  const { isAuthenticated } = useAuthStore();
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [enquiryCar, setEnquiryCar] = useState<Car | null>(null);
  const [interceptMessage, setInterceptMessage] = useState('');
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const toggleWishlist = (id: string) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRentNow = (car: Car) => {
    if (!isAuthenticated) {
      setInterceptMessage('Please login first then book your car');
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedCar(car);
  };

  const categories = ['All', 'Sedan', 'SUV', 'MUV', 'Hatchback', 'Luxury', 'Sports'];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || car.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="bg-slate-50 min-h-screen py-12">
      <SEO 
        title="Self Drive Cars Fleet in Hyderabad | SUVs, Sedans & 7-Seaters | SL Rentals"
        description="Browse all self drive cars for rent in Hyderabad starting @ ₹1,800/day. Rent Mahindra Thar, Innova Crysta, Maruti Ertiga, Fronx, Baleno & Swift with doorstep delivery."
        canonicalPath="/fleet"
        keywords="self drive cars fleet hyderabad, rent suv hyderabad, 7 seater car rental hyderabad, mahindra thar self drive, innova crysta self drive hyderabad, ertiga rental hyderabad"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="mb-12 text-center">
          <span className="text-primary font-bold tracking-wider uppercase text-xs sm:text-sm mb-2 block">
            Hyderabad Rental Fleet
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary mb-3">
            Self Drive Cars Fleet in Hyderabad
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Choose from well-maintained, sanitized SUVs, Sedans, Hatchbacks, and 7-seater MUVs tailored for city drives, weddings, and outstation getaways.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by car model (e.g. Thar, Innova)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Filter size={20} className="text-gray-400 shrink-0 mr-2" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  category === cat 
                    ? 'bg-secondary text-white' 
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-slate-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {car.category}
                </span>
                <button 
                  onClick={() => toggleWishlist(car.id)}
                  aria-label={`Save ${car.name} to wishlist`}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart size={24} className={wishlist[car.id] ? "fill-red-500 text-red-500" : ""} />
                </button>
              </div>

              <div className="h-48 mb-6 flex items-center justify-center overflow-hidden bg-slate-100 rounded-xl">
                <img 
                  src={car.imageUrl} 
                  alt={`${car.name} - Self Drive Car Rental in Hyderabad | SL Rentals`}
                  loading="lazy" 
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-bold text-secondary mb-1">{car.name}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                    {car.transmission}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                    {car.fuelType}
                  </span>
                  <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                    {car.seats || (car.category === 'SUV' || car.category === 'MUV' ? 7 : 5)} Seats
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <div>
                    <span className="text-2xl font-bold text-secondary">₹{car.pricePerDay.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">/day</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEnquiryCar(car)}
                      className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-sm"
                    >
                      Enquire
                    </button>
                    <button 
                      onClick={() => handleRentNow(car)}
                      className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-sm"
                    >
                      Rent Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredCars.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 text-lg">No vehicles found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        interceptMessage={interceptMessage}
      />
      <BookingModal 
        isOpen={!!selectedCar}
        onClose={() => setSelectedCar(null)}
        car={selectedCar}
      />
      <EnquiryModal 
        isOpen={!!enquiryCar}
        onClose={() => setEnquiryCar(null)}
        car={enquiryCar}
      />
    </main>
  );
}
