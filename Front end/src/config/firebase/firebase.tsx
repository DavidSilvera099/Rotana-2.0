import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB63-WJ-bImhRsjt1eKWfQGSSIzJkj2qkY",
  authDomain: "rotana-a3045.firebaseapp.com",
  projectId: "rotana-a3045",
  storageBucket: "rotana-a3045.firebasestorage.app",
  messagingSenderId: "670866520164",
  appId: "1:670866520164:web:1c69d47c3427957de60771",
  measurementId: "G-95N14JNEMW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;