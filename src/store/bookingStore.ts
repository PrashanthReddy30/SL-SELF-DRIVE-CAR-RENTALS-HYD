import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import type { Booking } from '../types';
import { playAlertSound } from '../utils/playAlertSound';
import toast from 'react-hot-toast';

interface BookingState {
  bookings: Booking[];
  isInitialized: boolean;
  initialize: () => void;
  addBooking: (booking: Booking) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status'], assignedCarNumber?: string) => Promise<void>;
  completeBooking: (id: string, extraDays: number, extraHours: number, newTotal: number, carName?: string, carNumber?: string) => Promise<void>;
  updateAdminNote: (id: string, note: string) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;
    
    let isInitialLoad = true;
    
    onSnapshot(collection(db, 'bookings'), (snapshot: any) => {
      if (!isInitialLoad) {
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === 'added') {
            const data = change.doc.data() as Booking;
            if (data.source !== 'walk-in') {
              playAlertSound();
              toast(`New Booking: ${data.customerName}`, {
                icon: '🚙',
                duration: 5000,
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
              });
            }
          }
        });
      }
      isInitialLoad = false;

      const bookingsData = snapshot.docs.map((doc: any) => doc.data() as Booking);
      // Sort by createdAt descending
      bookingsData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      set({ bookings: bookingsData });
    });

    set({ isInitialized: true });
  },

  addBooking: async (booking) => {
    await setDoc(doc(db, 'bookings', booking.id), booking);
  },

  updateBookingStatus: async (id, status, assignedCarNumber) => {
    const updateData: any = { status };
    if (assignedCarNumber) {
      updateData.carNumber = assignedCarNumber;
    }
    await updateDoc(doc(db, 'bookings', id), updateData);
  },

  completeBooking: async (id, extraDays, extraHours, newTotal, carName, carNumber) => {
    const updateData: any = { 
      status: 'Completed',
      extraDays,
      extraHours,
      totalPrice: newTotal
    };
    if (carName) updateData.carName = carName;
    if (carNumber) updateData.carNumber = carNumber;
    await updateDoc(doc(db, 'bookings', id), updateData);
  },

  updateAdminNote: async (id, adminNote) => {
    await updateDoc(doc(db, 'bookings', id), { adminNote });
  },

  cancelBooking: async (id) => {
    await updateDoc(doc(db, 'bookings', id), { status: 'Cancelled' });
  },
}));
