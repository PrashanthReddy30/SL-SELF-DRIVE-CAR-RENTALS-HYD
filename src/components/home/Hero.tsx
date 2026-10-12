import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000",
      alt: "SL Self Drive Car Rentals in Hyderabad - Luxury Sedan & SUV Fleet"
    },
    {
      url: "/home pahe car.jpg",
      alt: "Self Drive Cars in Hyderabad - Thar, Innova Crysta, Ertiga & Swift"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <header className="relative bg-slate-900 overflow-hidden w-full h-[65vh] md:h-[75vh] min-h-[460px]">
      {/* Slider Images */}
      {images.map((img, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img 
            src={img.url} 
            alt={img.alt} 
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
          {/* Enhanced gradient overlay for maximum readability and aesthetics */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 pointer-events-none"></div>
        </div>
      ))}
      
      {/* SEO-Optimized Hero Content */}
      <div className="absolute inset-y-0 left-0 flex items-center z-20 px-4 sm:px-8 md:px-16 max-w-3xl">
        <div className="text-white">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-orange-400 mb-3 tracking-wide">
            <span>★ #1 Rated Self Drive Cars in Hyderabad</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-3 drop-shadow-lg tracking-tight">
            SL Self Drive Car Rentals Hyderabad
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium drop-shadow-md mb-6 leading-relaxed max-w-2xl">
            Drive your own way with clean, sanitized and well-maintained self drive cars starting from <span className="text-primary font-bold">₹1,800/day</span>. Instant doorstep delivery across Hyderabad.
          </p>

          {/* Internal Linking Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/fleet"
              className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/30 text-sm sm:text-base hover:scale-[1.02]"
            >
              <Car size={18} /> Explore Cars Fleet
            </Link>
            <a
              href="tel:+918106698859"
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/30 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm sm:text-base hover:scale-[1.02]"
            >
              <Phone size={18} /> Call: 8106698859
            </a>
          </div>

          {/* Feature Highlights Pills */}
          <div className="flex flex-wrap items-center gap-4 mt-8 text-xs sm:text-sm text-gray-300 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Zero Hidden Fees
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Doorstep Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Valid DL & Aadhaar Only
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        aria-label="Previous Car Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors hidden md:block"
      >
        <ChevronLeft size={28} />
      </button>
      <button 
        onClick={nextSlide}
        aria-label="Next Car Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors hidden md:block"
      >
        <ChevronRight size={28} />
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
      
      {/* Floating Trust Rating Badge */}
      <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-20 hidden md:flex items-center gap-3 border border-gray-100">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <span className="text-green-600 font-bold text-xl">★</span>
        </div>
        <div>
          <p className="font-bold text-secondary text-sm">4.9 / 5 Google Rating</p>
          <p className="text-xs text-gray-500 font-medium">2,000+ Happy Road Trips in Hyderabad</p>
        </div>
      </div>
    </header>
  );
}
