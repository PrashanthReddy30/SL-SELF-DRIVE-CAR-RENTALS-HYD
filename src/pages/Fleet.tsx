import { useFleetStore } from '../store/fleetStore';
import { Heart, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import AuthModal from '../components/auth/AuthModal';
import BookingModal from '../components/booking/BookingModal';
import EnquiryModal from '../components/booking/EnquiryModal';
import type { Car } from '../types';

export default function Fleet() {
  const { cars } = useFleetStore();
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [enquiryCar, setEnquiryCar] = useState<Car | null>(null);
  const interceptMessage = '';
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const toggleWishlist = (id: string) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRentNow = (car: Car) => {
    setSelectedCar(car);
  };

  const categories = ['All', 'Sedan', 'SUV', 'Luxury', 'Sports'];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || car.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-secondary mb-4">Our Complete Fleet</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Browse our collection of premium vehicles tailored for every occasion and need.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by car model..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
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
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart size={24} className={wishlist[car.id] ? "fill-red-500 text-red-500" : ""} />
                </button>
              </div>

              <div className="h-48 mb-6 flex items-center justify-center overflow-hidden bg-slate-100 rounded-xl">
                <img 
                  src={car.imageUrl} 
                  alt={car.name} 
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-bold text-secondary mb-1">{car.name}</h3>
                <div className="flex gap-3 text-sm text-gray-500 font-medium mb-6">
                  <span>{car.transmission}</span>
                  <span>•</span>
                  <span>{car.fuelType}</span>
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
    </div>
  );
}
