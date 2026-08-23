import { useState } from 'react';
import { X, Calendar, User, Phone, CreditCard } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import type { Car } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car | null;
}

export default function BookingModal({ isOpen, onClose, car }: BookingModalProps) {
  const { addBooking } = useBookingStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.mobile || '',
    aadhar: '',
    startDate: '',
    endDate: '',
    pickupLocation: 'Nagaram Main Road',
  });

  if (!isOpen || !car) return null;

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const days = calculateDays();
    const totalPrice = days * car.pricePerDay;

    addBooking({
      id: Date.now().toString(),
      carId: car.id,
      userId: user?.id,
      customerName: formData.name,
      customerPhone: formData.phone,
      aadharNumber: formData.aadhar,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      pickupLocation: formData.pickupLocation,
      totalPrice,
      status: 'Pending',
      createdAt: new Date().toISOString()
    });

    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-[100] flex items-center gap-2 transform transition-all animate-bounce-in';
    toast.innerHTML = '<span>✔</span> Booking request submitted successfully!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <img src={car.imageUrl} alt={car.name} className="w-24 h-16 object-cover rounded-lg" />
            <div>
              <h2 className="text-2xl font-bold text-secondary">{car.name}</h2>
              <p className="text-primary font-bold">₹{car.pricePerDay.toLocaleString()}<span className="text-gray-400 text-sm font-normal">/day</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-gray-400" /> Full Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium transition-all" 
                  placeholder="John Doe" 
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" /> Mobile Number
                </label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium transition-all" 
                  placeholder="+91 00000 00000" 
                />
              </div>

              {/* Aadhar */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CreditCard size={16} className="text-gray-400" /> Aadhar Number (ID Proof)
                </label>
                <input 
                  type="text" 
                  required
                  pattern="[0-9]{12}"
                  title="12 digit Aadhar number"
                  value={formData.aadhar}
                  onChange={e => setFormData({...formData, aadhar: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium tracking-widest transition-all" 
                  placeholder="0000 0000 0000" 
                />
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" /> Ride Start Date
                </label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" /> Ride End Date
                </label>
                <input 
                  type="date" 
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium transition-all" 
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mt-6 flex justify-between items-center border border-gray-100">
              <div>
                <p className="text-sm text-gray-500 font-medium">Estimated Total ({calculateDays()} days)</p>
                <p className="text-2xl font-bold text-secondary">₹{(calculateDays() * car.pricePerDay).toLocaleString()}</p>
              </div>
              <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-sm">
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
