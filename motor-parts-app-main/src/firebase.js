// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBSc02MKdPIscCvD33DtHDfSnOmt91lkrc",
  authDomain: "personal-projects-386fe.firebaseapp.com",
  projectId: "personal-projects-386fe",
  storageBucket: "personal-projects-386fe.appspot.com",
  messagingSenderId: "762550659341",
  appId: "1:762550659341:web:a6d01fd8db3171163da844",
  measurementId: "G-VGV3R1837N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
