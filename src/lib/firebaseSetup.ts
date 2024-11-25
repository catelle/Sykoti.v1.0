// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDU1F7336YA3I3VdHKx5JM10ty5tQxFHZQ",
  authDomain: "sykoti.firebaseapp.com",
  databaseURL: "https://sykoti-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sykoti",
  storageBucket: "sykoti.appspot.com",
  messagingSenderId: "96492002224",
  appId: "1:96492002224:web:0cf110a3d37dabd9fb1475",
  measurementId: "G-QRTNW9PYNR"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db= getFirestore(app);
const storage= getStorage(app);
const auth = getAuth();

export { db, auth , storage};
export default app;