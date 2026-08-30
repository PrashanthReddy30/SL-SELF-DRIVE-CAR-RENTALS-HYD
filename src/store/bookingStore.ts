import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import type { Booking } from '../types';

interface BookingState {
  bookings: Booking[];
  isInitialized: boolean;
  initialize: () => void;
  addBooking: (booking: Booking) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  completeBooking: (id: string, extraDays: number, extraHours: number, newTotal: number) => Promise<void>;
  updateAdminNote: (id: string, note: string) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;
    
    onSnapshot(collection(db, 'bookings'), (snapshot: any) => {
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

  updateBookingStatus: async (id, status) => {
    await updateDoc(doc(db, 'bookings', id), { status });
  },

  completeBooking: async (id, extraDays, extraHours, newTotal) => {
    await updateDoc(doc(db, 'bookings', id), { 
      status: 'Completed',
      extraDays,
      extraHours,
      totalPrice: newTotal
    });
  },

  updateAdminNote: async (id, adminNote) => {
    await updateDoc(doc(db, 'bookings', id), { adminNote });
  },

  cancelBooking: async (id) => {
    await updateDoc(doc(db, 'bookings', id), { status: 'Cancelled' });
  },
}));
