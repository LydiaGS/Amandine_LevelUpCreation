// ======================
// IMPORT FIREBASE
// ======================
import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { getAuth } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { getFirestore } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import { getStorage } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";


// ======================
// CONFIG FIREBASE
// ======================
const firebaseConfig = {
  apiKey: "AIzaSyDFdsNM9gOgVqDa_hMviIViEyJrMghETGg",
  authDomain: "amandinelevelupcreation.firebaseapp.com",
  projectId: "amandinelevelupcreation",
  storageBucket: "amandinelevelupcreation.firebasestorage.app",
  messagingSenderId: "782512340926",
  appId: "1:782512340926:web:17d388181b2d9492fe83ef"
};


// ======================
// INITIALISATION APP
// ======================
export const app = initializeApp(firebaseConfig);


// ======================
// EXPORT DES SERVICES
// ======================
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);