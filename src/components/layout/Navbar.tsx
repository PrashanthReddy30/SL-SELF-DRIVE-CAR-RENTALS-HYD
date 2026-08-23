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
            {user?.role === 'admin' ? (
              <Link to="/admin" className="bg-secondary text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-secondary/90 transition-colors">Admin</Link>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="text-gray-700 hover:text-primary font-medium transition-colors">Admin Login</button>
            )}
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
                  className="flex items-center gap-2 border border-gray-200 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {user?.role === 'admin' ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">
                        A
                      </div>
                      <span className="font-semibold text-sm text-secondary">Admin ⌄</span>
                    </>
                  ) : (
                    <>
                      <UserCircle size={32} className="text-gray-400" />
                      <span className="font-semibold text-sm text-gray-700">{user?.name.split(' ')[0]} ⌄</span>
                    </>
                  )}
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 flex flex-col z-50">
                    {user?.role === 'admin' ? (
                      <Link to="/admin" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <LayoutDashboard size={16} className="text-primary" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link to="/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Settings size={16} className="text-gray-400" />
                        My Bookings
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }} 
                      className="px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 text-left"
                    >
                      <LogOut size={16} />
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
