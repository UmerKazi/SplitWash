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
const auth = getAuth(app);
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

  const registerWithEmailAndPassword = async (email, password, firstName, lastName, phoneNumber) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: firstName + ' ' +  lastName,
        firstName,
        lastName,
        phoneNumber,
        email,
        car: "",
        carImg: "",
        photoURL: 'https://i.pinimg.com/474x/f1/da/a7/f1daa70c9e3343cebd66ac2342d5be3f.jpg',
      })
      await updateProfile(user, {
        'displayName': firstName
      });
    } catch (err) {
      console.log(err);
    }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err == 'FirebaseError: Firebase: Error (auth/wrong-password).') {
      alert("Incorrect Password, Please Try Again");
    } else if (err == "FirebaseError: Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
      alert("Too Many Failed Login Attempts, Please Reset Your Password or Try Again Later");
    } else if (err == "FirebaseError: Firebase: Error (auth/email-already-in-use).") {
      alert("Email Already In Use");
    }
  }
};

const getUserInfo = async () => {
  const user = getAuth().currentUser
  const q1 = query(collection(db, "users"), where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q1);
  let userInfo = [];
  querySnapshot.forEach((doc) => {
    userInfo.push(doc.data());
  })
  return userInfo;
}

const setCar = async (make, model, year) => {
  const user = getAuth().currentUser
  const usersRef = doc(db, "users", user.uid);
  await updateDoc(usersRef, {
    "car": year + " " + make + " " + model
  })
}

const getCar = async () => {
  const user = getAuth().currentUser
  const q1 = query(collection(db, "users"), where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q1);
  let car = [];
  querySnapshot.forEach((doc) => {
    car.push(doc.data().car);
  })
  return car;
}

const logout = () => {
  signOut(auth);
}

  export {
    useCarWash,
    getCarWash,
    registerWithEmailAndPassword,
    logInWithEmailAndPassword,
    logout,
    setCar,
    getCar,
    getUserInfo,
    auth,
  }