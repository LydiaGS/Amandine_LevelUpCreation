// ======================
// IMPORTS FIREBASE
// ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, query,
  orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getStorage, ref as storageRef, uploadBytes, getDownloadURL, listAll
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// ======================
// CONFIGURATION FIREBASE
// ======================
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ======================
// DOM ELEMENTS
// ======================
const loading = document.getElementById("loading");
const dashboard = document.getElementById("dashboard");
const userEmail = document.getElementById("userEmail");

const profilePreview = document.getElementById("profilePreview");
const profilePhoto = document.getElementById("profilePhoto");
const saveProfile = document.getElementById("saveProfile");
const nameInput = document.getElementById("name");
const companyInput = document.getElementById("company");

const chatBox = document.getElementById("chatBox");
const msgInput = document.getElementById("msgInput");
const sendMsg = document.getElementById("sendMsg");

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const fileList = document.getElementById("fileList");

const logoutBtn = document.getElementById("logoutBtn");

const scrollBtn = document.getElementById("scrollTopBtn");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMsg = document.getElementById("newsletterMsg");

// ======================
// GESTION AUTH ET DASHBOARD
// ======================
onAuthStateChanged(auth, user => {
  if(user) {
    loading.style.display = "none";
    dashboard.style.display = "block";
    userEmail.textContent = "Connecté en tant que : " + user.email;
    loadProfile(user);
    initChatListener();
    loadFilesList();
  } else {
    loading.style.display = "none";
    dashboard.style.display = "none";
  }
});

// ======================
// PROFIL
// ======================
async function loadProfile(user){
  nameInput.value = user.displayName || "";
  profilePreview.src = user.photoURL || "./asset/image/amandine.jpeg";
}

profilePhoto.addEventListener("change", async e => {
  const file = e.target.files[0];
  if(!file) return;

  const fileRef = storageRef(storage, `profile/${auth.currentUser.uid}/${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  profilePreview.src = url;
  await updateProfile(auth.currentUser, { photoURL: url });
  alert("Photo de profil mise à jour !");
});

saveProfile.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  if(name){
    await updateProfile(auth.currentUser, { displayName: name });
    alert("Profil mis à jour !");
  }
});

// ======================
// CHAT FIRESTORE
// ======================
function initChatListener(){
  const q = query(collection(db, "messages"), orderBy("createdAt"));
  onSnapshot(q, snapshot => {
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const { text, uid } = doc.data();
      const div = document.createElement("div");
      div.textContent = text;
      div.className = uid === auth.currentUser.uid ? "my-msg" : "other-msg";
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

sendMsg.addEventListener("click", async () => {
  const text = msgInput.value.trim();
  if(!text) return;

  await addDoc(collection(db, "messages"), {
    text,
    uid: auth.currentUser.uid,
    createdAt: serverTimestamp()
  });
  msgInput.value = "";
});

// ======================
// UPLOAD DE FICHIERS
// ======================
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if(!file) return;

  const refFile = storageRef(storage, `files/${auth.currentUser.uid}/${file.name}`);
  await uploadBytes(refFile, file);

  alert("Fichier uploadé !");
  loadFilesList();
});

async function loadFilesList(){
  fileList.innerHTML = "";
  const listRef = storageRef(storage, `files/${auth.currentUser.uid}/`);
  const res = await listAll(listRef);
  for(let item of res.items){
    const url = await getDownloadURL(item);
    const li = document.createElement("li");
    li.innerHTML = `<a href="${url}" target="_blank">${item.name}</a>`;
    fileList.appendChild(li);
  }
}

// ======================
// LOGOUT
// ======================
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("./login.html");
});

// ======================
// SCROLL TOP
// ======================
window.addEventListener("scroll", () => {
  if(window.scrollY > 300){
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ======================
// NEWSLETTER EMAILJS
// ======================
newsletterForm?.addEventListener("submit", e => {
  e.preventDefault();
  sendNewsletterEmail();
});

function sendNewsletterEmail(){
  const emailInput = document.getElementById("newsletterEmail");
  const email = emailInput?.value.trim();
  if(!email){
    newsletterMsg.textContent = "❌ Entre une adresse email.";
    newsletterMsg.style.color = "red";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if(!emailRegex.test(email)){
    newsletterMsg.textContent = "❌ Adresse email invalide.";
    newsletterMsg.style.color = "red";
    return;
  }

  newsletterMsg.textContent = "⏳ Inscription en cours...";
  newsletterMsg.style.color = "#fff";

  emailjs.send("service_bt9an7x", "template_0b0qafq", {
    email,
    date: new Date().toLocaleString("fr-BE")
  })
  .then(() => {
    newsletterMsg.textContent = "✅ Merci ! Vérifie ta boîte mail 🚀";
    newsletterMsg.style.color = "#22c55e";
    emailInput.value = "";
  })
  .catch(err => {
    console.error(err);
    newsletterMsg.textContent = "❌ Erreur d’envoi. Réessaie.";
    newsletterMsg.style.color = "red";
  });
}

// ======================
// FOOTER YEAR
// ======================
document.getElementById("year").textContent = new Date().getFullYear();



