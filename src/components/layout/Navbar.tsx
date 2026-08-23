import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Phone, Search, UserCircle, LogOut, Settings, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import AuthModal from '../auth/AuthModal';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                SL
              </div>
              <div>
                <span className="font-bold text-xl text-secondary block leading-tight">SL Self Drive</span>
                <span className="text-xs text-gray-500 font-medium">Car Rentals</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">Home</Link>
            <Link to="/fleet" className="text-gray-700 hover:text-primary font-medium transition-colors">Fleet</Link>
            <Link to="/services" className="text-gray-700 hover:text-primary font-medium transition-colors">Services</Link>
            <Link to="/team" className="text-gray-700 hover:text-primary font-medium transition-colors">Team</Link>
            <Link to="/faq" className="text-gray-700 hover:text-primary font-medium transition-colors">FAQ</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary font-medium transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+918106698859" className="flex items-center gap-2 text-sm font-semibold bg-gray-100 px-4 py-2 rounded-full text-secondary hover:bg-gray-200 transition-colors">
              <Phone size={16} className="text-primary" />
              +91 8106698859
            </a>
            <button className="text-gray-500 hover:text-primary transition-colors">
              <Search size={20} />
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-secondary font-bold hover:text-primary transition-colors px-3 py-2 flex items-center gap-1 border-r border-gray-200 pr-4"
                >
                  Admin Login
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-secondary font-medium hover:text-primary transition-colors px-3 py-2"
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-primary text-white px-5 py-2 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 border border-gray-200 pl-2 pr-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors group"
                >
                  <UserCircle size={28} className="text-primary group-hover:text-primary-hover transition-colors" />
                  <span className="font-semibold text-sm text-secondary">
                    {user?.role === 'admin' ? 'Admin' : user?.name.split(' ')[0]} ⌄
                  </span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 flex flex-col z-50">
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-secondary">{user?.role === 'admin' ? 'Admin' : user?.name}</p>
                      <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{user?.email}</p>
                    </div>

                    {user?.role === 'admin' && (
                      <Link to="/admin" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-3 transition-colors">
                        <LayoutDashboard size={18} />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link to="/profile" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-3 transition-colors">
                      <Settings size={18} />
                      My Bookings
                    </Link>
                    
                    <button 
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }} 
                      className="px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 text-left transition-colors mt-1 border-t border-gray-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <button className="text-gray-500 hover:text-primary transition-colors">
              <Search size={24} />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-primary"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Home</Link>
            <Link to="/fleet" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Fleet</Link>
            <Link to="/services" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Services</Link>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3 px-3">
                  <button 
                    onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                    className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                    className="w-full bg-primary text-white px-4 py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {user?.role === 'admin' ? (
                     <Link to="/admin" className="block px-3 py-3 rounded-md text-base font-medium text-primary hover:bg-gray-50">Admin Dashboard</Link>
                  ) : (
                    <Link to="/profile" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">My Profile & Bookings</Link>
                  )}
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
}
