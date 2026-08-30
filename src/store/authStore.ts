import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  initialize: () => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // We need to fetch the extra user data (like name, phone, role) from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          set({ user: userData, isAuthenticated: true });
        } else {
          // Fallback if no firestore document exists yet (e.g. just signed up)
          set({ 
            user: {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              mobile: '',
              role: firebaseUser.email === 'admin@slrentals.com' ? 'admin' : 'customer'
            }, 
            isAuthenticated: true 
          });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    });

    set({ isInitialized: true });
  },

  login: (user) => set({ user, isAuthenticated: true }),
  
  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },
}));
