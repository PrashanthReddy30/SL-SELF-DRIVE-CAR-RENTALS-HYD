
export default function Hero() {
  return (
    <div className="relative bg-slate-50 overflow-hidden w-full h-[60vh] md:h-[70vh] min-h-[400px]">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Red Sports Car" 
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay to make it look premium */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Quotation / Tagline */}
      <div className="absolute inset-y-0 left-0 flex items-center z-20 px-4 sm:px-8 md:px-16 max-w-3xl">
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
            The journey matters more than the destination.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-medium drop-shadow-md">
            Drive your own story with RideWave SL Self Drive
          </p>
        </div>
      </div>
      
      {/* Floating Badge (optional, but keeps some of the original flair) */}
      <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl z-20 hidden md:flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-600 font-bold text-xl">★</span>
        </div>
        <div>
          <p className="font-bold text-secondary">4.9/5 Rating</p>
          <p className="text-xs text-gray-500 font-medium">Based on 2000+ reviews</p>
        </div>
      </div>
    </div>
  );
}
