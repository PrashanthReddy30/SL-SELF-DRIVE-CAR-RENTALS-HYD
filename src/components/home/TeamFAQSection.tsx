import { User, Phone, CalendarDays } from 'lucide-react';

export default function TeamFAQSection() {
  const team = [
    { name: 'John Walker', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
    { name: 'Alan Smith', role: 'Rental Manager', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
    { name: 'Tomas Brown', role: 'Customer Service', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
    { name: 'Andrew Black', role: 'Fleet Manager', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Team Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Our Specialists</span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">Meet The Team</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="relative rounded-3xl overflow-hidden group">
                <img src={member.img} alt={member.name} className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="p-4 text-center">
                    <h4 className="text-white font-bold text-lg">{member.name}</h4>
                    <p className="text-white/80 text-sm font-medium">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Enquiry Box Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Quick Connect</span>
            <h2 className="text-3xl font-bold text-secondary">Send an Enquiry</h2>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input type="text" placeholder="John Doe" className="pl-11 w-full border border-gray-200 rounded-xl py-3.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-gray-700 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input type="tel" placeholder="+91 00000 00000" className="pl-11 w-full border border-gray-200 rounded-xl py-3.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-gray-700 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CalendarDays size={18} className="text-gray-400" />
                </div>
                <input type="date" className="pl-11 w-full border border-gray-200 rounded-xl py-3.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-gray-700 transition-all" />
              </div>
            </div>

            <div className="md:col-span-3 mt-2">
              <button type="button" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                Submit Enquiry
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
