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
        group: "",
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
  const umerCarImg = "https://firebasestorage.googleapis.com/v0/b/splitwash-22737.appspot.com/o/g20.png?alt=media&token=77d8d8ca-9bcf-4e24-b3e1-86cd4d396d68";
  const babaCarImg = "https://firebasestorage.googleapis.com/v0/b/splitwash-22737.appspot.com/o/s560.png?alt=media&token=5f52a11a-5f8e-4ef8-9a34-a06a073650b0";
  const abeerCarImg = "https://firebasestorage.googleapis.com/v0/b/splitwash-22737.appspot.com/o/gt.png?alt=media&token=8f28b373-4637-44f7-956b-e2a66b6195d8";
  const mamaCarImg = "https://firebasestorage.googleapis.com/v0/b/splitwash-22737.appspot.com/o/lx600.png?alt=media&token=1f5e99ad-102f-460c-8e5b-3a376110d344";
  const zaraCarImg = "https://firebasestorage.googleapis.com/v0/b/splitwash-22737.appspot.com/o/sentra.png?alt=media&token=d02a2791-dd1b-4cc4-a5be-b62fc4d05ba8";
  const taniaCarImg = "https://firebasestorage.googleapis.com/v0/b/splitwash-22737.appspot.com/o/crosstrek.png?alt=media&token=5d2e99be-b7d4-4ca0-8598-2a0c0c768700";
  const defaultCarImg = "https://firebasestorage.googleapis.com/v0/b/splitwash-22737.appspot.com/o/defaultCar.png?alt=media&token=c5f34232-befb-4bcc-a863-40d10756599d";
  try {
    await updateDoc(usersRef, {
      "car": year + " " + make + " " + model
    })
    if ((year + " " + make + " " + model) == "2022 BMW 330i xDrive") {
      await updateDoc(usersRef, {
        "carImg": umerCarImg
      })
    } else if ((year + " " + make + " " + model) == "2022 Ford Mustang GT") {
      await updateDoc(usersRef, {
        "carImg": abeerCarImg
      })
    } else if ((year + " " + make + " " + model) == "2020 Mercades-Benz S560") {
      await updateDoc(usersRef, {
        "carImg": babaCarImg
      })
    } else if ((year + " " + make + " " + model) == "2022 Lexus LX600") {
      await updateDoc(usersRef, {
        "carImg": mamaCarImg
      })
    } else if ((year + " " + make + " " + model) == "2022 Nissan Sentra") {
      await updateDoc(usersRef, {
        "carImg": zaraCarImg
      })
    } else if ((year + " " + make + " " + model) == "2020 Subaru Crosstrek") {
      await updateDoc(usersRef, {
        "carImg": taniaCarImg
      })
    } 
    
    else {
      await updateDoc(usersRef, {
        "carImg": defaultCarImg
      })
    }
  } catch (err) {
    console.log(err);
  }
  
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

const createGroup = async (dateBought, username, password) => {
  const user = getAuth().currentUser
  const usersRef = doc(db, "users", user.uid);
  const groupID = '_' + Math.random().toString(36).substr(2, 9);
  try {
    await setDoc(doc(db, "groups", groupID), {
      admin: user.uid,
      adminName: user.displayName,
      dateBought,
      username,
      password,
      days: [],
      members: [],
      groupID,
    })
    await updateDoc(usersRef, {
      "group": groupID
    });
  } catch {
    console.log(err);
  }
}

const joinGroup = async (groupID) => {
  const user = getAuth().currentUser
  const usersRef = doc(db, "users", user.uid);
  const groupRef = doc(db, "groups", groupID);
  await updateDoc(usersRef, {
    "group": groupID
  });
  await updateDoc(groupRef, {
    members: arrayUnion(user.uid)
  });
}

const verifyGroup = async (groupID) => {
  const q1 = query(collection(db, "groups"), where("groupID", "==", groupID));
  const querySnapshot = await getDocs(q1);
  let groups = [];
  querySnapshot.forEach((doc) => {
    groups.push(doc.data());
  })
  if (groups.length > 0) {
    return true;
  } else {
    return false;
  }
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
    createGroup,
    joinGroup,
    verifyGroup,
  }