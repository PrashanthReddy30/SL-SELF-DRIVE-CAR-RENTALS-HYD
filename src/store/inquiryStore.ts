import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  carName?: string;
  preferredDate?: string;
  message: string;
  status: 'Unread' | 'Read' | 'Resolved';
  createdAt: string;
}

interface InquiryState {
  inquiries: Inquiry[];
  isInitialized: boolean;
  initialize: () => void;
  addInquiry: (inquiry: Inquiry) => Promise<void>;
  updateStatus: (id: string, status: Inquiry['status']) => Promise<void>;
}

export const useInquiryStore = create<InquiryState>((set, get) => ({
  inquiries: [],
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;
    
    onSnapshot(collection(db, 'inquiries'), (snapshot: any) => {
      const inquiriesData = snapshot.docs.map((doc: any) => doc.data() as Inquiry);
      // Sort by createdAt descending
      inquiriesData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      set({ inquiries: inquiriesData });
    });

    set({ isInitialized: true });
  },

  addInquiry: async (inquiry) => {
    // Write to Firestore - local state will update automatically via onSnapshot
    await setDoc(doc(db, 'inquiries', inquiry.id), inquiry);
  },

  updateStatus: async (id, status) => {
    // Write to Firestore - local state will update automatically via onSnapshot
    await updateDoc(doc(db, 'inquiries', id), { status });
  },
}));
