import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtHRMtLjM1hf4afaoK15rHvKW1Zi9jYRo",
  authDomain: "studyhub-bbc32.firebaseapp.com",
  projectId: "studyhub-bbc32",
  storageBucket: "studyhub-bbc32.firebasestorage.app",
  messagingSenderId: "898439751413",
  appId: "1:898439751413:web:b2f4a7041c0317c484c7bc",
  measurementId: "G-61WBFZV1RH"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();