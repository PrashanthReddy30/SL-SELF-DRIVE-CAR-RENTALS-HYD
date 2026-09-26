import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import type { Booking } from '../types';
import { playAlertSound } from '../utils/playAlertSound';
import toast from 'react-hot-toast';
import { useFleetStore } from './fleetStore';

interface BookingState {
  bookings: Booking[];
  completedBookings: Booking[];
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
  completedBookings: [],
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;
    
    let isInitialLoad = true;
    
    // Listen to active bookings
    onSnapshot(collection(db, 'bookings'), (snapshot: any) => {
      if (!isInitialLoad) {
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === 'added') {
            const data = change.doc.data() as Booking;
            if (data.source !== 'walk-in') {
              playAlertSound();
              
              const carName = useFleetStore.getState().cars.find(c => c.id === data.carId)?.name || 'a vehicle';
              const timeString = new Date(data.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              toast(() => (
                <div className="flex flex-col gap-1">
                  <span className="font-bold">New Booking Received!</span>
                  <span className="text-sm"><b>{data.customerName}</b> booked <b>{carName}</b></span>
                  <span className="text-xs text-gray-400 mt-1">{timeString}</span>
                </div>
              ), {
                icon: '🚙',
                duration: 6000,
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
              });
            }
          }
        });
      }
      isInitialLoad = false;

      const bookingsData = snapshot.docs.map((doc: any) => doc.data() as Booking);
      bookingsData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      set({ bookings: bookingsData });
    });

    // Listen to completed bookings separately
    onSnapshot(collection(db, 'completed_bookings'), (snapshot: any) => {
      const completedData = snapshot.docs.map((doc: any) => doc.data() as Booking);
      completedData.sort((a: any, b: any) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
      
      set({ completedBookings: completedData });
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
    // 1. Fetch the existing booking
    const oldDocRef = doc(db, 'bookings', id);
    const docSnap = await getDoc(oldDocRef);
    if (!docSnap.exists()) return;
    
    const bookingData = docSnap.data();

    // 2. Prepare the updated completed data
    const completedData: any = {
      ...bookingData,
      status: 'Completed',
      extraDays,
      extraHours,
      totalPrice: newTotal
    };
    if (carName) completedData.carName = carName;
    if (carNumber) completedData.carNumber = carNumber;

    // 3. Write it to completed_bookings collection
    await setDoc(doc(db, 'completed_bookings', id), completedData);

    // 4. Delete it from active bookings collection
    await deleteDoc(oldDocRef);
  },

  updateAdminNote: async (id, adminNote) => {
    await updateDoc(doc(db, 'bookings', id), { adminNote });
  },

  cancelBooking: async (id) => {
    await updateDoc(doc(db, 'bookings', id), { status: 'Cancelled' });
  },
}));
