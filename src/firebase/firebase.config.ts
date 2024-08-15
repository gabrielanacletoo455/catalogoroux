import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9FfvCuiaG5OTOY9JZ7axAS3gTkWlBJ-I",
  authDomain: "maramodas-7ddd0.firebaseapp.com",
  projectId: "maramodas-7ddd0",
  storageBucket: "maramodas-7ddd0.appspot.com",
  messagingSenderId: "992067496528",
  appId: "1:992067496528:web:cae3e468ae682db86b7f55"
};

// Initialize Firebase
export const appFireBase = initializeApp(firebaseConfig);
export const db =  getFirestore(appFireBase);
