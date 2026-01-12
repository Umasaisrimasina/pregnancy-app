// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtHCjnnau1AaOcsiEWvgWfHGSRYjqGHc8",
  authDomain: "pregnancy-app-8e45a.firebaseapp.com",
  projectId: "pregnancy-app-8e45a",
  storageBucket: "pregnancy-app-8e45a.firebasestorage.app",
  messagingSenderId: "913255217548",
  appId: "1:913255217548:web:67debfa727b3a63ed13ea9",
  measurementId: "G-1DT7G8GWDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
