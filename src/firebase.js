import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlyH7MhTQT8YDKrvlSb3bqbgPyIHv1deU",
  authDomain: "emergency-app-safety-vault.firebaseapp.com",
  databaseURL: "https://emergency-app-safety-vault-default-rtdb.firebaseio.com",
  projectId: "emergency-app-safety-vault",
  storageBucket: "emergency-app-safety-vault.firebasestorage.app",
  messagingSenderId: "443629136807",
  appId: "1:443629136807:web:e55d52bf2295b7e285a482",
  measurementId: "G-D0ELKBMG5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const rtdb = getDatabase(app); 
export const auth = getAuth(app);
export const db = getFirestore(app);
