import { useState } from 'react';
import { User, LogOut, Key, Shield, Smartphone, Mail, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function AdminProfile() {
  const { logout, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handlePasswordReset = async () => {
    try {
      setIsResetting(true);
      // Ensure we send it to the exact admin email from state if available, or fallback
      const email = user?.email || 'admin@slrentals.com';
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-secondary hover:bg-slate-300 transition-colors"
      >
        <User size={20} />
      </button>

      {/* Dropdown / Modal */}
      {isOpen && (
        <>
          {/* Backdrop for mobile and closing when clicking outside */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 md:bg-transparent" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up origin-top-right">
            <div className="bg-secondary p-6 text-white text-center relative">
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
              <div className="w-16 h-16 bg-white/10 rounded-full mx-auto flex items-center justify-center mb-3">
                <Shield size={32} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg">G.RameshYadhav</h3>
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Super Admin</p>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Smartphone size={16} className="text-gray-400" />
                  <span className="font-medium">8106698859</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span className="font-medium">slcarrentals.in</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              <button 
                onClick={handlePasswordReset}
                disabled={isResetting}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Key size={16} />
                  <span>{isResetting ? 'Sending...' : 'Reset Admin Password'}</span>
                </div>
              </button>
              
              <button 
                onClick={() => logout()}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
            
            <div className="bg-slate-50 p-3 text-center border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-400">Website Version: v1.0.0</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
