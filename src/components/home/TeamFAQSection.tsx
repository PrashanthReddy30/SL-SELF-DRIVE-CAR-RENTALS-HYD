import { useState } from 'react';
import { User, Phone, CalendarDays, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useInquiryStore } from '../../store/inquiryStore';

export default function TeamFAQSection() {


  const { addInquiry } = useInquiryStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredDate: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "What documents are required to rent a car?", a: "You need a valid original Driving License (DL) and an Aadhaar Card. We will keep a copy for our records." },
    { q: "Is there a security deposit?", a: "Yes, a refundable security deposit is required before the trip starts. The amount depends on the car model." },
    { q: "What is the daily mileage limit?", a: "Most of our cars come with a generous daily limit (e.g., 250-300 km/day). Extra kilometers are charged nominally per km." },
    { q: "Do I need to pay for fuel?", a: "Cars are delivered with a specific fuel level. You must return it with the same level, or you will be charged for the difference." }
  ];

  const testimonials = [
    { name: "Rahul S.", text: "Excellent condition cars and very professional service. Highly recommend SL Car Rentals for weekend trips!", rating: 5 },
    { name: "Priya M.", text: "The booking process was so smooth and the owner was very cooperative. The car was clean and well maintained.", rating: 5 },
    { name: "Karthik Reddy", text: "Best self-drive cars in Nagaram. Transparent pricing and no hidden charges. Loved the experience.", rating: 5 }
  ];

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

        {/* Testimonials Section */}
        <div className="mt-24 mb-16">
          <div className="text-center mb-10">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Reviews</span>
            <h2 className="text-3xl font-bold text-secondary">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 mb-6 italic">"{t.text}"</p>
                <div className="font-bold text-secondary">- {t.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Support</span>
            <h2 className="text-3xl font-bold text-secondary">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl bg-slate-50 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center font-bold text-secondary hover:bg-slate-100 transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </section>
  );
}
