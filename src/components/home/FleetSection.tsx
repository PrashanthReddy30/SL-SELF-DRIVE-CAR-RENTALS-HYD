import { useFleetStore } from '../../store/fleetStore';
import { useAuthStore } from '../../store/authStore';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingModal from '../booking/BookingModal';
import AuthModal from '../auth/AuthModal';
import type { Car } from '../../types';

export default function FleetSection() {
  const { cars } = useFleetStore();
  const { isAuthenticated } = useAuthStore();
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [interceptMessage, setInterceptMessage] = useState('');
  const navigate = useNavigate();

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

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Car Rentals</span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Our Top Fleet</h2>
            <p className="text-gray-500">Comfort, affordability, and convenience</p>
          </div>
          <button 
            onClick={() => navigate('/fleet')}
            className="text-primary font-bold hover:text-primary-hover flex items-center gap-2"
          >
            View All Cars →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.slice(0, 6).map((car) => (
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
                  <button 
                    onClick={() => handleRentNow(car)}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          ))}
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
    </section>
  );
}
