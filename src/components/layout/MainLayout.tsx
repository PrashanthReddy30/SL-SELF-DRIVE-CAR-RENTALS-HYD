import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919999999999" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all hover:scale-110 z-50 flex items-center justify-center group"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle size={28} fill="currentColor" className="text-white" />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm font-semibold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Need help? Chat with us!
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </span>
      </a>
    </div>
  );
}
