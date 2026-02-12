// /javascripts/dashboard.js
import { app, auth, onAuthStateChanged, signOut } from "./firebaseClient.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const db = getFirestore(app);

const loading = document.getElementById("loading");
const dashboard = document.getElementById("dashboard");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("./login.html");
    return;
  }
  if (loading) loading.style.display = "none";
  if (dashboard) dashboard.style.display = "block";
  if (userEmail) userEmail.textContent = "Connecté : " + user.email;

  try {
    await loadDocuments(user.uid);
    await loadProject(user.uid);
    await loadMessages(user.uid);
    await loadFormations(user.uid);
  } catch (err) {
    console.error("Erreur Firestore:", err);
  }
});

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("./login.html");
});

// ------------------- LOADERS -------------------

async function loadDocuments(uid) {
  const container = document.getElementById("documents");
  if (!container) return;

  container.innerHTML = "<li>Chargement...</li>";

  const q = query(collection(db, "documents"), where("userId", "==", uid));
  const snap = await getDocs(q);

  container.innerHTML = "";
  if (snap.empty) {
    container.innerHTML = "<li>Aucun document pour le moment.</li>";
    return;
  }

  snap.forEach((docu) => {
    const data = docu.data();
    container.innerHTML += `
      <li><a href="${data.url}" target="_blank" rel="noopener">${data.title}</a></li>
    `;
  });
}

async function loadProject(uid) {
  const container = document.getElementById("project");
  if (!container) return;

  container.innerHTML = "Chargement...";

  const q = query(collection(db, "projects"), where("userId", "==", uid));
  const snap = await getDocs(q);

  if (snap.empty) {
    container.innerHTML = "<p>Aucun projet lié pour le moment.</p>";
    return;
  }

  const data = snap.docs[0].data();
  container.innerHTML = `
    <p>Status : <strong>${data.status || "—"}</strong></p>
    <p>Progression : ${data.progress ?? 0}%</p>
  `;
}

async function loadMessages(uid) {
  const container = document.getElementById("messages");
  if (!container) return;

  container.innerHTML = "<p>Chargement...</p>";

  const q = query(collection(db, "messages"), where("userId", "==", uid));
  const snap = await getDocs(q);

  container.innerHTML = "";
  if (snap.empty) {
    container.innerHTML = "<p>Aucun message pour le moment.</p>";
    return;
  }

  snap.forEach((m) => {
    const data = m.data();
    container.innerHTML += `
      <p><strong>${data.sender || "—"} :</strong> ${data.text || ""}</p>
    `;
  });
}

async function loadFormations(uid) {
  const container = document.getElementById("formations");
  if (!container) return;

  container.innerHTML = "<li>Chargement...</li>";

  const snap = await getDocs(collection(db, "formations"));

  container.innerHTML = "";
  let found = 0;

  snap.forEach((f) => {
    const data = f.data();
    const access = Array.isArray(data.userAccess) ? data.userAccess : [];

    if (access.includes(uid)) {
      found++;
      container.innerHTML += `
        <li><a href="${data.url}" target="_blank" rel="noopener">${data.title}</a></li>
      `;
    }
  });

  if (found === 0) {
    container.innerHTML = "<li>Aucune formation disponible pour ton compte.</li>";
  }
}
