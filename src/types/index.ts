export type Role = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
}

export type CarCategory = 'Sedan' | 'SUV' | 'MUV' | 'Hatchback' | 'Luxury' | 'Sports';
export type Transmission = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  transmission: Transmission;
  fuelType: FuelType;
  pricePerDay: number;
  imageUrl: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  carId: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  aadharNumber: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  pickupLocation: string;
  totalPrice: number;
  status: BookingStatus;
  adminNote?: string;
  createdAt: string;
}
