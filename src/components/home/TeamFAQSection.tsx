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
    </section>
  );
}
