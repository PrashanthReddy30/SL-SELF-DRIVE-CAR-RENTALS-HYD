import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import type { Car } from '../types';

interface FleetState {
  cars: Car[];
  isInitialized: boolean;
  initialize: () => void;
  addCar: (car: Car) => Promise<void>;
  updateCar: (id: string, updatedFields: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
}

const initialCars: Car[] = [
  {
    id: 'c1',
    name: 'Mahindra Thar',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Diesel',
    pricePerDay: 4000,
    seats: 4,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDaRLRwb-m6Y7CP0DKmC2FSdetL8rLOgEGqA90-RLnvNsNECHP5tMYNwEZCD7pQpE&s&ec=121966392',
  },
  {
    id: 'c2',
    name: 'Toyota Innova Crysta',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Diesel',
    pricePerDay: 4000,
    seats: 7,
    imageUrl: '/innova%20crysta.png',
  },
  {
    id: 'c3',
    name: 'Maruti Ertiga',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2800,
    seats: 7,
    imageUrl: '/ertiga.jpg',
  },
  {
    id: 'c4',
    name: 'Tata Nexon',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2400,
    seats: 5,
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg',
  },
  {
    id: 'c5',
    name: 'Maruti Baleno',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2000,
    seats: 5,
    imageUrl: '/maruti-suzuki-baleno.webp',
  },
  {
    id: 'c6',
    name: 'Toyota Glanza',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2000,
    seats: 5,
    imageUrl: '/Toyota%20Glanza.jpeg.avif',
    carNumbers: [
      { number: 'TS08JU1684', owner: 'Ramesh' },
      { number: 'TS08KD1153', owner: 'Suresh' }
    ]
  },
  {
    id: 'c7',
    name: 'Maruti Fronx',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 2000,
    seats: 5,
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.jpeg',
  },
  {
    id: 'c8',
    name: 'Maruti Swift',
    category: 'MUV',
    transmission: 'Manual',
    fuelType: 'Petrol',
    pricePerDay: 1800,
    seats: 5,
    imageUrl: '/swift.jpg',
  }
];

export const useFleetStore = create<FleetState>((set, get) => ({
  cars: [],
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;
    
    const carsRef = collection(db, 'cars');
    
    // Check if empty and seed initial data
    const snapshot = await getDocs(carsRef);
    if (snapshot.empty) {
      console.log('Seeding initial cars to Firestore...');
      for (const car of initialCars) {
        await setDoc(doc(db, 'cars', car.id), car);
      }
    }

    onSnapshot(carsRef, (snapshot: any) => {
      const carsData = snapshot.docs.map((doc: any) => doc.data() as Car);
      set({ cars: carsData });
    });

    set({ isInitialized: true });
  },

  addCar: async (car) => {
    await setDoc(doc(db, 'cars', car.id), car);
  },

  updateCar: async (id, updatedFields) => {
    await updateDoc(doc(db, 'cars', id), updatedFields as any);
  },

  deleteCar: async (id) => {
    await deleteDoc(doc(db, 'cars', id));
  }
}));
