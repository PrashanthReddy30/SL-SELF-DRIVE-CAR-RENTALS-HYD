import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function TeamFAQSection() {
  const team = [
    { name: 'John Walker', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
    { name: 'Alan Smith', role: 'Rental Manager', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
    { name: 'Tomas Brown', role: 'Customer Service', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
    { name: 'Andrew Black', role: 'Fleet Manager', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
  ];

  const faqs = [
    { q: 'What documents do I need to rent a car?', a: 'You will need a valid driving license, an Aadhar card or passport for ID proof, and a valid credit card for the security deposit.' },
    { q: 'Is there a mileage limit on rentals?', a: 'Most of our rentals come with a standard mileage limit of 250km per day. Additional mileage is charged at a nominal per-km rate.' },
    { q: 'What is your cancellation policy?', a: 'Free cancellation up to 24 hours before the pickup time. Cancellations within 24 hours may incur a one-day rental fee.' },
    { q: 'Do you provide outstation cabs with a driver?', a: 'Yes, we offer premium outstation rental packages that include professional, verified drivers.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

        {/* FAQ & Blog Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* FAQ */}
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Answers</span>
            <h2 className="text-3xl font-bold text-secondary mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between py-4 text-left font-bold text-secondary hover:text-primary transition-colors"
                  >
                    {faq.q}
                    {openFaq === idx ? <Minus size={20} className="text-primary" /> : <Plus size={20} className="text-gray-400" />}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-500 text-sm leading-relaxed pb-4">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blog News */}
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Updates</span>
            <h2 className="text-3xl font-bold text-secondary mb-8">Latest Blog & News</h2>
            
            <div className="space-y-6">
              {[
                { title: 'Top Rental Tips for 2024', date: 'Oct 15, 2023', img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=300' },
                { title: 'Electric vs Gas: Which is better?', date: 'Nov 02, 2023', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?auto=format&fit=crop&q=80&w=300' },
              ].map((blog, idx) => (
                <div key={idx} className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-32 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={blog.img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <span className="text-primary font-bold text-xs uppercase tracking-wider">{blog.date}</span>
                    <h4 className="font-bold text-secondary text-lg mt-1 mb-2 group-hover:text-primary transition-colors">{blog.title}</h4>
                    <span className="text-sm text-gray-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <span className="text-primary">→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
