import { useState } from 'react';
import { X, Calendar, User, Phone, Send } from 'lucide-react';
import { useInquiryStore } from '../../store/inquiryStore';
import { useAuthStore } from '../../store/authStore';
import type { Car } from '../../types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car | null;
}

export default function EnquiryModal({ isOpen, onClose, car }: EnquiryModalProps) {
  const { addInquiry } = useInquiryStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.mobile || '',
    email: user?.email || '',
    preferredDate: '',
    message: ''
  });

  if (!isOpen || !car) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addInquiry({
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email, // using user email if available, otherwise blank
      phone: formData.phone,
      carName: car.name,
      preferredDate: formData.preferredDate,
      message: formData.message || `I would like to enquire about renting the ${car.name}.`,
      status: 'Unread',
      createdAt: new Date().toISOString()
    });

    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-[100] flex items-center gap-2 transform transition-all animate-bounce-in';
    toast.innerHTML = '<span>✔</span> Enquiry sent successfully!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <img src={car.imageUrl} alt={car.name} className="w-20 h-14 object-cover rounded-lg" />
            <div>
              <h2 className="text-xl font-bold text-secondary">Enquire about {car.name}</h2>
              <p className="text-gray-500 text-sm">Our team will contact you shortly.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-gray-400" /> Full Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="Your Name" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" /> Phone Number
                </label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="+91 00000 00000" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" /> Preferred Date
                </label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.preferredDate}
                  onChange={e => setFormData({...formData, preferredDate: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  Message (Optional)
                </label>
                <textarea 
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" 
                  placeholder="Any specific requirements?" 
                ></textarea>
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-sm flex items-center justify-center gap-2">
              <Send size={18} /> Send Enquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
