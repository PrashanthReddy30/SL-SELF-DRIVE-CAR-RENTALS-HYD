import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoCwEnKIdYu88uOdaCznPNrb0Ja8zMNhY",
  authDomain: "sl-self-drive-car-rentals-hyd.firebaseapp.com",
  projectId: "sl-self-drive-car-rentals-hyd",
  storageBucket: "sl-self-drive-car-rentals-hyd.firebasestorage.app",
  messagingSenderId: "845368829712",
  appId: "1:845368829712:web:a9862980a228d9d7686795",
  measurementId: "G-09X2TP515J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
