import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeTSHvHMGAz8g87PbHAP2HQCX1xF-MSTY",
  authDomain: "studio-6021525983-cee23.firebaseapp.com",
  projectId: "studio-6021525983-cee23",
  storageBucket: "studio-6021525983-cee23.firebasestorage.app",
  messagingSenderId: "396005933181",
  appId: "1:396005933181:web:60ebbc202e34d2d3c9f114"
};

// Singleton pattern to prevent multiple initializations
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
