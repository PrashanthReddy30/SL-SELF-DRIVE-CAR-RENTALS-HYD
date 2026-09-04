import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Camera, Image as ImageIcon } from 'lucide-react';
import { auth, db, storage } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Tesseract from 'tesseract.js';
import React, { useRef } from 'react';

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
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCaptureAadhaar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAadhaarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAadhaarPreview(objectUrl);

    setIsOcrProcessing(true);
    try {
      const result = await Tesseract.recognize(file, 'eng');
      const text = result.data.text;
      
      // Try to find 12 consecutive digits after stripping all non-digits
      const digitsOnly = text.replace(/\D/g, '');
      const match = digitsOnly.match(/\d{12}/);
      
      if (match) {
        setAadhaar(match[0]);
      } else {
        // Fallback: check original text with relaxed spaces/dashes
        const relaxedMatch = text.match(/\d{4}[\s-]*\d{4}[\s-]*\d{4}/);
        if (relaxedMatch) {
          setAadhaar(relaxedMatch[0].replace(/\D/g, ''));
        } else {
          console.warn('OCR could not detect a 12-digit number.', text);
          alert('Could not automatically read Aadhaar number. Please type it in manually.');
        }
      }
    } catch (err) {
      console.error('OCR Error:', err);
      alert('OCR processing failed. Please enter the number manually.');
    } finally {
      setIsOcrProcessing(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const mobileClean = mobile.replace(/\D/g, '');
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(mobileClean)) {
        setError('Please enter a valid 10-digit Indian mobile number');
        setLoading(false);
        return;
      }

      const aadhaarClean = aadhaar.replace(/\s/g, '');
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(aadhaarClean)) {
        setError('Please enter a valid 12-digit Aadhaar number');
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const role = email.toLowerCase() === 'admin@slrentals.com' ? 'admin' : 'customer';
        
        let aadhaarUrl = '';
        if (aadhaarFile) {
          const storageRef = ref(storage, `aadhaar_proofs/${userCredential.user.uid}_${Date.now()}.jpg`);
          await uploadBytes(storageRef, aadhaarFile);
          aadhaarUrl = await getDownloadURL(storageRef);
        }

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          id: userCredential.user.uid,
          name: fullName,
          email: email,
          mobile: mobile,
          aadhaar: aadhaar.replace(/\s/g, ''),
          aadhaarUrl: aadhaarUrl,
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
                  placeholder="9876543210" 
                  maxLength={10}
                />
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      required 
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${isOcrProcessing ? 'bg-gray-100 text-gray-400' : ''}`} 
                      placeholder={isOcrProcessing ? 'Scanning...' : '1234 5678 9012'} 
                      maxLength={14}
                      disabled={isOcrProcessing}
                    />
                  </div>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleCaptureAadhaar}
                  />

                  {aadhaarPreview ? (
                    <div 
                      className="w-11 h-11 rounded-xl border border-gray-200 overflow-hidden cursor-pointer shrink-0 hover:border-primary transition-colors relative group"
                      onClick={() => setShowFullImage(true)}
                    >
                      <img src={aadhaarPreview} alt="Aadhaar Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon size={16} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-11 h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition-colors shrink-0"
                      title="Capture Aadhaar"
                    >
                      <Camera size={20} />
                    </button>
                  )}
                </div>
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
                  I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Terms & Conditions</a> and Privacy Policy.
                </label>
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-md mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <p>Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-primary font-bold hover:underline">Sign Up</button></p>
            ) : (
              <p>Already have an account? <button type="button" onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Login</button></p>
            )}
          </div>



        </div>
      </div>

      {/* Full Image Preview Modal */}
      {showFullImage && aadhaarPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setShowFullImage(false)}>
          <div className="relative max-w-3xl w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-white/20 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <img src={aadhaarPreview} alt="Aadhaar Full Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
