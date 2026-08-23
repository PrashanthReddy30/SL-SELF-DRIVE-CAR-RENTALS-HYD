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

const initialBookings: Booking[] = [
  {
    id: 'b1',
    carId: 'c1',
    userId: '1',
    customerName: 'Prashanth Reddy',
    customerPhone: '+91 9876543210',
    aadharNumber: '123456789012',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    pickupLocation: 'Nagaram Main Road',
    totalPrice: 13500,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b2',
    carId: 'c2',
    userId: '2',
    customerName: 'Chinna Reddy',
    customerPhone: '+91 8106698859',
    aadharNumber: '987654321098',
    startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    pickupLocation: 'Airport',
    totalPrice: 75000,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

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
      name: 'sl-booking-storage',
    }
  )
);
