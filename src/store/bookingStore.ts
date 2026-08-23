import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking } from '../types';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  updateAdminNote: (id: string, note: string) => void;
  cancelBooking: (id: string) => void;
}

const initialBookings: Booking[] = [];

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: initialBookings,
      addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
      updateBookingStatus: (id, status) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
      })),
      updateAdminNote: (id, adminNote) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, adminNote } : b)
      })),
      cancelBooking: (id) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b)
      })),
    }),
    {
      name: 'sl-bookings-v2',
    }
  )
);
