// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-9ac1e.firebaseapp.com",
    projectId: "mern-estate-9ac1e",
    storageBucket: "mern-estate-9ac1e.appspot.com",
    messagingSenderId: "863869619891",
    appId: "1:863869619891:web:1956e79e34b0b135226ac6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);