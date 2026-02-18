// /javascripts/firebaseClient.js

//import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

//import {
  //getAuth,
  //createUserWithEmailAndPassword,
  //signInWithEmailAndPassword,
  //signOut,
  //onAuthStateChanged
//} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";


/*const firebaseConfig = {
  apiKey: "AIzaSyDFdsNM9gOgVqDa_hMviIViEyJrMghETGg",
  authDomain: "amandinelevelupcreation.firebaseapp.com",
  projectId: "amandinelevelupcreation",
  storageBucket: "amandinelevelupcreation.firebasestorage.app",
  messagingSenderId: "782512340926",
  appId: "1:782512340926:web:17d388181b2d9492fe83ef"
};


export const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};*/
// /javascripts/firebaseClient.js

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { getFirestore } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import { getStorage } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyDFdsNM9gOgVqDa_hMviIViEyJrMghETGg",
  authDomain: "amandinelevelupcreation.firebaseapp.com",
  projectId: "amandinelevelupcreation",
  storageBucket: "amandinelevelupcreation.firebasestorage.app",
  messagingSenderId: "782512340926",
  appId: "1:782512340926:web:17d388181b2d9492fe83ef"
};


// Initialisation
export const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);


// Exports auth helpers
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
