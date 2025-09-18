
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, Firestore } from "firebase/firestore";

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

let db: Firestore;

try {
  db = getFirestore(app);
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence.');
    }
  });
} catch (e) {
  console.error("Error initializing Firestore:", e);
  db = getFirestore(app);
}


const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
