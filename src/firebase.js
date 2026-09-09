// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCI2jYQmOOh-yJY3Ltg13SpOTTWM9eYDFY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "my-portofolio-baf7d.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://my-portofolio-baf7d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "my-portofolio-baf7d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "my-portofolio-baf7d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "182561180743",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:182561180743:web:9ae644afe353e1bc027562",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-402BDF5NK3"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

// Firestore
export const db = getFirestore(app);