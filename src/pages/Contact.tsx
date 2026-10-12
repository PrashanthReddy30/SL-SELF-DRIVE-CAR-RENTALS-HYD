import { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { useInquiryStore } from '../store/inquiryStore';
import { useAuthStore } from '../store/authStore';

export default function Contact() {
  const { addInquiry } = useInquiryStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.mobile || '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.message) {
      alert("Please provide your name, phone number, and message.");
      return;
    }
    
    addInquiry({
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      status: 'Unread',
      createdAt: new Date().toISOString()
    });
    
    setIsSubmitted(true);
    setFormData({ ...formData, message: '' }); // Clear message
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <SEO
        title="Contact SL Self Drive Car Rentals Hyderabad | Phone, Location & Inquiries"
        description="Contact SL Self Drive Car Rentals in Hyderabad. 24/7 customer service, booking inquiries, office address at Nagaram Main Road, ECIL, Hyderabad. Call +91 8106698859."
        canonical="/contact"
        keywords="contact sl self drive car rentals, car rental phone number hyderabad, car rentals nagaram hyderabad, book self drive car hyderabad customer care"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold text-sm rounded-full mb-3">
            24/7 Customer Support
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-secondary mb-4 tracking-tight">
            Contact SL Self Drive Car Rentals Hyderabad
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Have questions about car rental rates, security deposits, or doorstep delivery? Call us directly or submit your inquiry below. Our team is ready 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-secondary">Contact Details</h2>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                <Phone size={22} />
              </div>
              <h3 className="text-base font-bold text-secondary mb-1">Phone / WhatsApp</h3>
              <p className="text-gray-500 text-sm mb-2">Available 24/7 for bookings & RSA</p>
              <a href="tel:+918106698859" className="text-primary font-bold hover:underline text-lg">+91 8106698859</a>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                <Mail size={22} />
              </div>
              <h3 className="text-base font-bold text-secondary mb-1">Email Support</h3>
              <p className="text-gray-500 text-sm mb-2">Corporate & customer queries</p>
              <a href="mailto:support@slrentals.in" className="text-primary font-bold hover:underline">support@slrentals.in</a>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                <MapPin size={22} />
              </div>
              <h3 className="text-base font-bold text-secondary mb-1">Office Location</h3>
              <p className="text-gray-500 text-sm">Nagaram Main Road, Near ECIL<br/>Hyderabad, Telangana 500083</p>
            </div>

            {/* Quick Links */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-secondary mb-3">Quick Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/fleet" className="text-primary font-semibold hover:underline flex items-center gap-1.5">
                    <Car size={14} /> Browse Self Drive Fleet
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-primary font-semibold hover:underline flex items-center gap-1.5">
                    <HelpCircle size={14} /> Common Questions (FAQ)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-3xl font-bold text-secondary mb-8 relative">Send an Inquiry</h2>
            
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in relative">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                  <Send size={32} />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
                <p className="text-green-700">Thank you for reaching out. Our team will review your inquiry and get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                  <textarea 
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" 
                    placeholder="How can we help you today? (e.g., Dates, car model, destination)"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send size={20} /> Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
