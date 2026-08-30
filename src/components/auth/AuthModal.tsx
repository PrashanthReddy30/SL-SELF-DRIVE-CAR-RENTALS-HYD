import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  interceptMessage?: string;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login', interceptMessage }: AuthModalProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  // const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const role = email.toLowerCase() === 'admin@slrentals.com' ? 'admin' : 'customer';
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          id: userCredential.user.uid,
          name: fullName,
          email: email,
          mobile: mobile,
          role: role
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-[100] flex items-center gap-2 transform transition-all animate-bounce-in';
      toast.innerHTML = `<span>✔</span> ${mode === 'login' ? 'Login' : 'Account created'} successful!`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);

      onClose();

      const role = email.toLowerCase() === 'admin@slrentals.com' ? 'admin' : 'customer';
      if (role === 'admin') {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {interceptMessage && (
          <div className="bg-orange-50 p-4 flex items-center gap-3 border-b border-orange-100">
            <Lock className="text-primary" size={20} />
            <div>
              <p className="font-semibold text-orange-800 text-sm">Login Required</p>
              <p className="text-xs text-orange-600">{interceptMessage}</p>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 w-full border border-gray-200 rounded-xl py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>
            )}
            
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  required 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="+91 0000000000" 
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border border-gray-200 rounded-xl py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="you@example.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full border border-gray-200 rounded-xl py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="flex items-start gap-2 mt-2">
                <input type="checkbox" id="terms" required className="mt-1 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-tight">
                  I agree to the Terms & Conditions and Privacy Policy.
                </label>
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-md mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-medium text-gray-400 uppercase">Or continue with</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            </button>
            <button className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-[#1877F2]">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-[#1DA1F2]">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <p>Don't have an account? <button onClick={() => setMode('signup')} className="text-primary font-bold hover:underline">Sign Up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Login</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
