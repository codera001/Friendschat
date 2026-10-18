// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg2JPjMPa0J_B-XDyIo4hT5UzfQyA5xDk",
  authDomain: "friends-chat-d422c.firebaseapp.com",
  projectId: "friends-chat-d422c",
  storageBucket: "friends-chat-d422c.appspot.com",
  messagingSenderId: "578054358496",
  appId: "1:578054358496:web:e288ac89561f7ea7899785",
  measurementId: "G-PJT3FF706L"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth =getAuth();
export const storage = getStorage();
export const analytics = getAnalytics(app);
export const db = getFirestore()