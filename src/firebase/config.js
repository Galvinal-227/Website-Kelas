import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9gGN4nw4hOD0RgKt5cQAwrA4YYocIySM",
  authDomain: "pplg-1.firebaseapp.com",
  projectId: "pplg-1",
  storageBucket: "pplg-1.firebasestorage.app",
  messagingSenderId: "673373613080",
  appId: "1:673373613080:web:783189f2fd61ad3a8ae76d",
  measurementId: "G-PMJRY9PMT8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { 
  app, auth, db, storage,
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
  ref, uploadBytes, getDownloadURL
};