import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-dc_qll0Y5vfUnevZqDIXlTTMsE3lJuA",
  authDomain: "saas-onboarding-dashboard.firebaseapp.com",
  projectId: "saas-onboarding-dashboard",
  storageBucket: "saas-onboarding-dashboard.firebasestorage.app",
  messagingSenderId: "830991039440",
  appId: "1:830991039440:web:2c58d458ec0147ab2697d5",
  measurementId: "G-8H5CT66B89"
    // Keep your existing Firebase configuration here
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
