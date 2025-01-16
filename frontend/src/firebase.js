// firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from '@firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYwF6pq6LGG9IXh971F8NRiPZ_agS9_sA",
  authDomain: "portfolio-1445f.firebaseapp.com",
  projectId: "portfolio-1445f",
  storageBucket: "portfolio-1445f.firebasestorage.app",
  messagingSenderId: "308000597476",
  appId: "1:308000597476:web:44ac807d828e52437b13f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
