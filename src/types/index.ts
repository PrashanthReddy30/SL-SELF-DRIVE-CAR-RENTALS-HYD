export type Role = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
}

export type CarCategory = 'Sedan' | 'SUV' | 'Luxury' | 'Sports';
export type Transmission = 'Automatic' | 'Manual';

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  transmission: Transmission;
  pricePerDay: number;
  imageUrl: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  pickupLocation: string;
  totalPrice: number;
  status: BookingStatus;
  adminNote?: string;
  createdAt: string;
}
