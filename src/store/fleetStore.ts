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
    name: 'Mahindra Thar',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Diesel',
    pricePerDay: 4000,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDaRLRwb-m6Y7CP0DKmC2FSdetL8rLOgEGqA90-RLnvNsNECHP5tMYNwEZCD7pQpE&s&ec=121966392',
  },
  {
    id: 'c2',
    name: 'Toyota Innova Crysta',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Diesel',
    pricePerDay: 4000,
    imageUrl: '/innova%20crysta.png',
  },
  {
    id: 'c3',
    name: 'Maruti Ertiga',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2800,
    imageUrl: '/ertiga.jpg',
  },
  {
    id: 'c4',
    name: 'Tata Nexon',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2400,
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg',
  },
  {
    id: 'c5',
    name: 'Maruti Baleno',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2000,
    imageUrl: '/maruti-suzuki-baleno.webp',
  },
  {
    id: 'c6',
    name: 'Toyota Glanza',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2000,
    imageUrl: '/Toyota%20Glanza.avif',
  },
  {
    id: 'c7',
    name: 'Maruti Fronx',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2000,
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.jpeg',
  },
  {
    id: 'c8',
    name: 'Maruti Swift',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 1800,
    imageUrl: '/swift.jpg',
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
      name: 'sl-fleet-storage-v9',
    }
  )
);
