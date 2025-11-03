import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyAorD9R4FiSq6M1MeJwFukkO3Leu7q6F7o",
  authDomain: "cozey-8ad64.firebaseapp.com",
  databaseURL: "https://cozey-8ad64.firebaseio.com",
  projectId: "cozey-8ad64",
  storageBucket: "cozey-8ad64.appspot.com",
  messagingSenderId: "841803166613",
  appId: "1:841803166613:web:154d11830d7ef9144f3c9c",
  measurementId: "G-94BYMYTS85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
