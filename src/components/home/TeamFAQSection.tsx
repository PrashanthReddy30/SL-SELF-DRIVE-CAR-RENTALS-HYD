import { useState } from 'react';
import { User, Phone, CalendarDays } from 'lucide-react';
import { useInquiryStore } from '../../store/inquiryStore';

export default function TeamFAQSection() {


  const { addInquiry } = useInquiryStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredDate: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      alert("Please provide your name and phone number.");
      return;
    }

    addInquiry({
      id: Date.now().toString(),
      name: formData.name,
      email: '',
      phone: formData.phone,
      preferredDate: formData.preferredDate,
      message: 'Quick Connect Enquiry from Homepage',
      status: 'Unread',
      createdAt: new Date().toISOString()
    });

    setIsSubmitted(true);
    setFormData({ name: '', phone: '', preferredDate: '' });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team Section Removed */}
      </div>        {/* Enquiry Box Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Quick Connect</span>
            <h2 className="text-3xl font-bold text-secondary">Send an Enquiry</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                  className="pl-11 w-full border border-gray-200 rounded-xl py-3.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-gray-700 transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 00000 00000" 
                  className="pl-11 w-full border border-gray-200 rounded-xl py-3.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-gray-700 transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CalendarDays size={18} className="text-gray-400" />
                </div>
                <input 
                  type="date" 
                  value={formData.preferredDate}
                  onChange={e => setFormData({...formData, preferredDate: e.target.value})}
                  className="pl-11 w-full border border-gray-200 rounded-xl py-3.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-gray-700 transition-all" 
                />
              </div>
            </div>

            <div className="md:col-span-3 mt-2">
              {isSubmitted ? (
                <div className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg text-center shadow-lg shadow-green-500/30 animate-fade-in">
                  Enquiry Sent Successfully!
                </div>
              ) : (
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                  Submit Enquiry
                </button>
              )}
            </div>
          </form>
        </div>

      </section>
  );
}
