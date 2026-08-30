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
    imageUrl: 'https://media.vyaparify.com/vcards/products/67264/Screenshot-2024-09-27-175241.png',
  },
  {
    id: 'c3',
    name: 'Maruti Ertiga',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2800,
    imageUrl: 'https://i.pinimg.com/736x/d1/aa/08/d1aa08546f1f9bbeb34896d0293e711d.jpg',
  },
  {
    id: 'c4',
    name: 'Tata Nexon',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2400,
    imageUrl: 'https://wallpapercave.com/wp/wp6700556.jpg',
  },
  {
    id: 'c5',
    name: 'Maruti Baleno',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2000,
    imageUrl: 'https://c.ndtvimg.com/2019-02/c0geikg8_maruti-suzuki-baleno-facelift_625x300_20_February_19.jpg',
  },
  {
    id: 'c6',
    name: 'Toyota Glanza',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2000,
    imageUrl: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Glanza/10231/1767782580969/front-left-side-47.jpg',
  },
  {
    id: 'c7',
    name: 'Maruti Fronx',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2000,
    imageUrl: 'https://www.motoring-trends.com/uploads/article/664_0_crop_100/fronx.jpg',
  },
  {
    id: 'c8',
    name: 'Maruti Swift',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 1800,
    imageUrl: 'https://c4.wallpaperflare.com/wallpaper/906/597/185/cars-suzuki-wallpaper-preview.jpg',
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
      name: 'sl-fleet-storage-v6',
    }
  )
);
