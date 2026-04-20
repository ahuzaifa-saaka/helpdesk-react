// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAhVRHrG6zJ-_5l4s8PLeVF2xPvxULPFU",
  authDomain: "helpdesk-e28f6.firebaseapp.com",
  projectId: "helpdesk-e28f6",
  storageBucket: "helpdesk-e28f6.firebasestorage.app",
  messagingSenderId: "559445033527",
  appId: "1:559445033527:web:d6a8f4b1bfbb9609b4b5b2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
