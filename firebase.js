// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
    onAuthStateChanged,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    setDoc,
    addDoc,
    collection,
    where,
    getDoc,
    doc,
    updateDoc,
    arrayUnion,
    deleteDoc,
    FieldValue,
    arrayRemove,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const useCarWash = async (name) => {
    const todayDate = new Date()
    todayDate.setTime(todayDate.getTime() + todayDate.getTimezoneOffset() * 60 * 1000);
    const offset = -240;
    const todayDateEST = new Date(todayDate.getTime() + offset * 60 * 1000);
    const today = todayDateEST.toISOString().slice(0, 10);
    try {
      await setDoc(doc(db, "days", today), {
        name: name,
        used: true,
        date: today,
        fullDate: todayDateEST,
      })
    } catch (err) {
      console.log(err);
    }
  }

  const getCarWash = async (date) => {
    const q1 = query(collection(db, "days"), where("date", "==", date));
    const querySnapshot = await getDocs(q1);
    let days = [];
    querySnapshot.forEach((doc) => {
      days.push(doc.data());
    })
    return days;
  }

  export {
    useCarWash,
    getCarWash,
  }