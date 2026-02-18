import { auth, db, storage } from "./firebaseClient.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js";
/* =========================
   AUTH
========================= */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("./login.html");
    return;
  }

  loading.style.display = "none";
  dashboard.style.display = "block";
  userEmail.textContent = "Connecté : " + user.email;

  await loadProfile(user.uid);
  await loadDocuments(user.uid);
  await loadProject(user.uid);
  listenMessages(user.uid);
  listenPlanning(user.uid);
  listenFormations(user.uid);
  listenInvoices(user.uid);
});

/* =========================
   LOGOUT
========================= */

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("./login.html");
});

// ======================
// MENU BURGER
// ======================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !expanded);
  navLinks.classList.toggle('nav__links--open');
});

// ======================
// SIMULATION CONNEXION
// ======================
const loading = document.getElementById('loading');
const dashboard = document.getElementById('dashboard');

// Ici tu peux remplacer par une vraie vérification utilisateur
setTimeout(() => {
  loading.style.display = 'none';
  dashboard.style.display = 'block';
}, 1000); // Simule un chargement

// ======================
// PHOTO DE PROFIL
// ======================
const profilePhotoInput = document.getElementById('profilePhoto');
const profilePreview = document.getElementById('profilePreview');

profilePhotoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(file){
    profilePreview.src = URL.createObjectURL(file);
  }
});

// ======================
// ENREGISTRER PROFIL
// ======================
const saveProfileBtn = document.getElementById('saveProfile');
saveProfileBtn.addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const company = document.getElementById('company').value;
  alert(`Profil sauvegardé:\nNom: ${name}\nSociété: ${company}`);
});

// ======================
// CHAT BASIQUE
// ======================
const chatBox = document.getElementById('chatBox');
const msgInput = document.getElementById('msgInput');
const sendMsgBtn = document.getElementById('sendMsg');

sendMsgBtn.addEventListener('click', () => {
  const msg = msgInput.value.trim();
  if(msg){
    const div = document.createElement('div');
    div.textContent = msg;
    div.className = 'chat-msg';
    chatBox.appendChild(div);
    msgInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

// ======================
// UPLOAD DE FICHIERS
// ======================
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileList = document.getElementById('fileList');

uploadBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  if(file){
    const li = document.createElement('li');
    li.textContent = file.name;
    fileList.appendChild(li);
    fileInput.value = '';
    alert('Fichier ajouté à la liste (simulation)');
  }
});

// ======================
// LOGOUT
// ======================
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  alert('Déconnexion réussie (simulation)');
  dashboard.style.display = 'none';
  loading.style.display = 'block';
  setTimeout(() => {
    loading.style.display = 'none';
  }, 500);
});

// ======================
// NEWSLETTER
// ======================
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = newsletterForm.querySelector('input[type="email"]').value;
  alert(`Merci pour votre inscription : ${email}`);
  newsletterForm.reset();
});

// ======================
// ANNEE DYNAMIQUE FOOTER
// ======================
document.getElementById('year').textContent = new Date().getFullYear();
