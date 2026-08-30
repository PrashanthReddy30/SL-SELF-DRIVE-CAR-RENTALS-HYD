import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Car } from '../types';

interface FleetState {
  cars: Car[];
  addCar: (car: Car) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
}

const initialCars: Car[] = [
  {
    id: 'c1',
    name: 'Mahindra Thar (Black)',
    category: 'SUV',
    transmission: 'Diesel Manual',
    pricePerDay: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800', // Black Jeep/SUV placeholder
  },
  {
    id: 'c2',
    name: 'Rolls-Royce Ghost',
    category: 'Luxury',
    transmission: 'Automatic',
    pricePerDay: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1631269666723-5e9a4fce1a2f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'c3',
    name: 'Porsche Macan 4',
    category: 'SUV',
    transmission: 'Automatic',
    pricePerDay: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1503376760367-1329a2444635?auto=format&fit=crop&q=80&w=800', // temporary substitute
  },
  {
    id: 'c4',
    name: 'Cayenne S E-Hybrid',
    category: 'SUV',
    transmission: 'Automatic',
    pricePerDay: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'c5',
    name: 'Nissan GT-R',
    category: 'Sports',
    transmission: 'Automatic',
    pricePerDay: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'c6',
    name: 'Panamera Turbo',
    category: 'Sedan',
    transmission: 'Automatic',
    pricePerDay: 14000,
    imageUrl: 'https://images.unsplash.com/photo-1503376760367-1329a2444635?auto=format&fit=crop&q=80&w=800',
  }
];

export const useFleetStore = create<FleetState>()(
  persist(
    (set) => ({
      cars: initialCars,
      addCar: (car) => set((state) => ({ cars: [...state.cars, car] })),
      updateCar: (id, updatedFields) => set((state) => ({
        cars: state.cars.map(c => c.id === id ? { ...c, ...updatedFields } : c)
      })),
      deleteCar: (id) => set((state) => ({
        cars: state.cars.filter(c => c.id !== id)
      })),
    }),
    {
      name: 'sl-fleet-storage-v2',
    }
  )
);
