// ======================
// IMPORT FIREBASE
// ======================
import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { 
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot // 🆕 AJOUTÉ ICI
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import { 
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";


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


// ======================
// EXPORT AUTH METHODS
// ======================
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};


// ======================
// EXPORT FIRESTORE METHODS
// ======================
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot // 🆕 AJOUTÉ ICI
};


// ======================
// EXPORT STORAGE METHODS
// ======================
export {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};


// ======================
// 🛠️ HELPER FUNCTIONS
// ======================

/**
 * Récupère les données d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Object|null} Données utilisateur ou null
 */
export async function getUserData(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      return userDocSnap.data();
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting user data:", error);
    throw error;
  }
}

/**
 * Met à jour les données d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} data - Données à mettre à jour
 */
export async function updateUserData(userId, data) {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, data);
    console.log("✅ User data updated successfully");
  } catch (error) {
    console.error("❌ Error updating user data:", error);
    throw error;
  }
}

/**
 * Crée un nouveau document utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} userData - Données de l'utilisateur
 */
export async function createUserDocument(userId, userData) {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp()
    });
    console.log("✅ User document created successfully");
  } catch (error) {
    console.error("❌ Error creating user document:", error);
    throw error;
  }
}

/**
 * Upload une image vers Firebase Storage
 * @param {File} file - Fichier à uploader
 * @param {string} path - Chemin dans Storage (ex: "profile-photos/userId/avatar.jpg")
 * @returns {string} URL de téléchargement
 */
export async function uploadImage(file, path) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("✅ Image uploaded successfully");
    return downloadURL;
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    throw error;
  }
}

/**
 * Supprime une image de Firebase Storage
 * @param {string} path - Chemin du fichier
 */
export async function deleteImage(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log("✅ Image deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    throw error;
  }
}

/**
 * Récupère tous les avis validés (pour reviews)
 * @returns {Array} Liste des avis
 */
export async function getApprovedReviews() {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('approved', '==', true));
    const querySnapshot = await getDocs(q);
    
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    return reviews;
  } catch (error) {
    console.error("❌ Error getting reviews:", error);
    throw error;
  }
}

/**
 * Ajoute un nouvel avis (non approuvé par défaut)
 * @param {Object} reviewData - Données de l'avis
 */
export async function addReview(reviewData) {
  try {
    const reviewsRef = collection(db, 'reviews');
    await addDoc(reviewsRef, {
      ...reviewData,
      approved: false,
      createdAt: serverTimestamp()
    });
    console.log("✅ Review added successfully");
  } catch (error) {
    console.error("❌ Error adding review:", error);
    throw error;
  }
}

