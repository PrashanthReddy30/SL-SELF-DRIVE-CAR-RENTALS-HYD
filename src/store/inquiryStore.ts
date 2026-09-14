import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import { playAlertSound } from '../utils/playAlertSound';
import toast from 'react-hot-toast';

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
    
    let isInitialLoad = true;
    
    onSnapshot(collection(db, 'inquiries'), (snapshot: any) => {
      if (!isInitialLoad) {
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === 'added') {
            const data = change.doc.data() as Inquiry;
            playAlertSound();
            
            const timeString = new Date(data.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            toast((t) => (
              <div className="flex flex-col gap-1">
                <span className="font-bold">New Inquiry Received!</span>
                <span className="text-sm">From: <b>{data.name}</b></span>
                {data.carName && <span className="text-xs text-gray-300">Car: {data.carName}</span>}
                <span className="text-xs text-gray-400 mt-1">{timeString}</span>
              </div>
            ), {
              icon: '💬',
              duration: 6000,
              style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
          }
        });
      }
      isInitialLoad = false;

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
