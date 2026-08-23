import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-lg text-gray-500">Have questions about our car rentals? Want to know more about long-term leasing? Send us a message and our team will get back to you immediately.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold text-secondary mb-2">Phone</h3>
              <p className="text-gray-500 mb-2">Available 24/7 for support</p>
              <a href="tel:+918106698859" className="text-primary font-bold hover:underline">+91 8106698859</a>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold text-secondary mb-2">Email</h3>
              <p className="text-gray-500 mb-2">Send us your queries</p>
              <a href="mailto:support@slrentals.com" className="text-primary font-bold hover:underline">support@slrentals.com</a>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-secondary mb-2">Location</h3>
              <p className="text-gray-500">Nagaram Main Road<br/>Hyderabad, Telangana</p>
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
                    placeholder="How can we help you today?"
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
