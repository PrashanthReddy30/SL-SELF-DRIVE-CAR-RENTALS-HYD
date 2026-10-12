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
    { 
      q: "What documents are required for self drive car rental in Hyderabad?", 
      a: "You only need a valid original Driving License (DL) and an Aadhaar Card. Verification is quick, 100% paperless, and takes under 2 minutes." 
    },
    { 
      q: "How much is the security deposit and when is it refunded?", 
      a: "We charge a minimal refundable security deposit depending on the car category (Hatchback/Sedan/SUV). It is refunded immediately to your UPI/bank upon vehicle return inspection." 
    },
    { 
      q: "What is the daily kilometer allowance on self drive cars?", 
      a: "Our standard booking includes a generous 300–400 km/day allowance. We also offer unlimited kilometer packages for extended outstation trips." 
    },
    { 
      q: "Can I drive the rental car outside Hyderabad or outstation?", 
      a: "Yes! All our vehicles carry valid All-India Tourist permits and Fastags, making them fully eligible for road trips to Srisailam, Tirupati, Vijayawada, Warangal, Bangalore, Goa, and beyond." 
    },
    { 
      q: "Do you deliver cars to Rajiv Gandhi International Airport (RGIA)?", 
      a: "Yes, we provide 24/7 doorstep vehicle delivery and collection at Rajiv Gandhi International Airport (RGIA Shamshabad), railway stations, and hotels across Hyderabad." 
    }
  ];

  const testimonials = [
    { name: "Rahul Sharma", text: "Best self drive car rental in Hyderabad! Hired the Mahindra Thar for a trip to Srisailam. Clean vehicle, smooth engine, and instant deposit refund.", rating: 5 },
    { name: "Priya Malladi", text: "Rented an Innova Crysta for a family wedding in Gachibowli. Top condition, super comfortable, and delivered right to our doorstep on time.", rating: 5 },
    { name: "Karthik Reddy", text: "Transparent pricing with zero hidden fees. The best self drive rental service in Nagaram & Secunderabad. Highly recommended!", rating: 5 }
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
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Customer Stories</span>
            <h2 className="text-3xl font-bold text-secondary">What Hyderabad Drivers Say About SL Car Rentals</h2>
            <p className="text-gray-500 text-sm mt-1">Real reviews from our satisfied travelers, tourists, and daily commuters.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 text-yellow-400">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-600 mb-6 italic text-sm leading-relaxed">"{t.text}"</p>
                </div>
                <div className="font-bold text-secondary text-sm">- {t.name} (Hyderabad)</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Help & Support</span>
            <h2 className="text-3xl font-bold text-secondary">Frequently Asked Questions About Car Rentals in Hyderabad</h2>
            <p className="text-gray-500 text-sm mt-1">Everything you need to know about booking, documentation, deposits, and fuel rules.</p>
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
