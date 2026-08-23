import { MapPin, Calendar } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Column: Search Form */}
          <div className="w-full lg:w-5/12 z-10">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h1 className="text-3xl lg:text-4xl font-bold text-secondary mb-2 tracking-tight">
                Find your perfect rental car today.
              </h1>
              <p className="text-gray-500 mb-8">Premium vehicles for any occasion.</p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Car Type</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none font-medium">
                    <option>Select Category...</option>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Luxury</option>
                    <option>Sports</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pick-up Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-gray-400" />
                      </div>
                      <input type="date" className="pl-10 w-full border border-gray-200 rounded-xl py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-gray-700" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Drop-off Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-gray-400" />
                      </div>
                      <input type="date" className="pl-10 w-full border border-gray-200 rounded-xl py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-gray-700" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input type="text" placeholder="Pickup City or Airport" className="pl-10 w-full border border-gray-200 rounded-xl py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium text-gray-700" />
                  </div>
                </div>

                <button type="button" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30 mt-4">
                  Search Cars
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="w-full lg:w-7/12 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square max-w-[800px]">
              <div className="w-full h-full bg-gradient-to-tr from-primary to-orange-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-2xl mx-auto flex justify-center">
              {/* Using a high quality unsplash image of a sports car */}
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] transform -rotate-6 z-0 hidden md:block"></div>
                <img 
                  src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1000" 
                  alt="Premium Red Sports Car" 
                  className="relative z-10 w-full h-auto object-cover rounded-3xl shadow-2xl"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl z-20 hidden md:flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xl">★</span>
                  </div>
                  <div>
                    <p className="font-bold text-secondary">4.9/5 Rating</p>
                    <p className="text-xs text-gray-500">Based on 2000+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
