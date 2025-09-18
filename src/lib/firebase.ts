
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqBTEoc5EVfYi1jX8yGsz6m8eHLehvZKY",
  authDomain: "studio-7108285578-efaf5.firebaseapp.com",
  projectId: "studio-7108285578-efaf5",
  storageBucket: "studio-7108285578-efaf5.appspot.com",
  messagingSenderId: "371662480472",
  appId: "1:371662480472:web:8296486201b16e8518562d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
