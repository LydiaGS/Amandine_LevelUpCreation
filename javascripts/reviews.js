import { app } from "./firebaseClient.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // DOM
  // =========================
  const form = document.getElementById("reviewForm");
  const btn = document.getElementById("reviewBtn");
  const success = document.getElementById("reviewSuccess");
  const list = document.getElementById("reviewsList");
  const avgEl = document.getElementById("avgRating");
  const countEl = document.getElementById("reviewCount");
  const hintEl = document.getElementById("reviewHint");
  const loadMoreBtn = document.getElementById("loadMoreReviews");
  const msg = document.getElementById("r_message");
  const charCount = document.getElementById("charCount");

  if (!form) return;

  let lastDocRef = null;

  // =========================
  // Helpers
  // =========================
  function escapeHTML(str = "") {
    return String(str).replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  function formatDate(ts) {
    if (!ts?.toDate) return "";
    return ts.toDate().toLocaleDateString("fr-BE", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  }

  function stars(rating = 0) {
    const r = Math.max(0, Math.min(5, Number(rating) || 0));
    return "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r);
  }

  function renderReview(doc) {
    const data = doc.data();
    const el = document.createElement("article");
    el.className = "review";

    el.innerHTML = `
      <div class="review__top">
        <p class="review__name">${escapeHTML(data.name)}</p>
        <p class="review__date">${formatDate(data.createdAt)}</p>
      </div>
      <div class="review__stars">${stars(data.rating)}</div>
      <p class="review__text">${escapeHTML(data.message)}</p>
    `;

    return el;
  }

  function showError(err) {
    console.error("Firestore error:", err);
    alert("Une erreur est survenue. Vérifie la console (F12).");
  }

  // =========================
  // Charger statistiques
  // =========================
  async function loadStats() {
    try {
      const q = query(
        collection(db, "reviews"),
        where("approved", "==", true)
      );

      const snap = await getDocs(q);

      const count = snap.size;
      let sum = 0;

      snap.forEach(d => {
        sum += Number(d.data().rating || 0);
      });

      const avg = count ? (sum / count).toFixed(1) : "—";

      if (countEl) countEl.textContent = count;
      if (avgEl) avgEl.textContent = avg;
      if (hintEl) {
        hintEl.textContent = count
          ? "Merci pour votre confiance 💗"
          : "Soyez le/la premier(e) à laisser un avis ✨";
      }

    } catch (err) {
      showError(err);
    }
  }

  // =========================
  // Charger avis
  // =========================
  async function loadReviews(reset = false) {

    if (reset) {
      lastDocRef = null;
      list.innerHTML = "";
    }

    try {
      const baseQuery = query(
        collection(db, "reviews"),
        where("approved", "==", true),
        orderBy("createdAt", "desc"),
        limit(6)
      );

      const q = lastDocRef
        ? query(
            collection(db, "reviews"),
            where("approved", "==", true),
            orderBy("createdAt", "desc"),
            startAfter(lastDocRef),
            limit(6)
          )
        : baseQuery;

      const snap = await getDocs(q);

      snap.forEach(doc => {
        list.appendChild(renderReview(doc));
      });

      lastDocRef = snap.docs[snap.docs.length - 1];

      if (loadMoreBtn) {
        loadMoreBtn.hidden = snap.size < 6;
      }

    } catch (err) {
      showError(err);
    }
  }

  // =========================
  // Compteur caractères
  // =========================
  if (msg && charCount) {
    charCount.textContent = msg.value.length;
    msg.addEventListener("input", () => {
      charCount.textContent = msg.value.length;
    });
  }

  // =========================
  // Envoi formulaire
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const rating = Number(form.rating.value);

    if (!name || name.length < 2) return alert("Nom invalide.");
    if (!message || message.length < 10) return alert("Message trop court.");
    if (!rating || rating < 1 || rating > 5) return alert("Choisis une note valide.");

    btn.disabled = true;
    btn.textContent = "ENVOI EN COURS…";

    try {
     await addDoc(collection(db, "reviews"), {
  name,
  email: email || null,
  message,
 rating: Number(rating),
  approved: false,
  page: window.location.href
});

      form.reset();
      charCount.textContent = "0";

      success.textContent = "Merci 💗 Votre avis a été envoyé.";
      success.hidden = false;

      setTimeout(() => {
        success.hidden = true;
      }, 5000);

    } catch (err) {
  console.error("Firestore error:", err);
  console.error("Code:", err.code);
  console.error("Message:", err.message);
  alert("Erreur Firestore, regarde la console.");
}

    btn.disabled = false;
    btn.textContent = "ENVOYER MON AVIS";
  });

  // =========================
  // Voir plus
  // =========================
  loadMoreBtn?.addEventListener("click", () => loadReviews());

  // =========================
  // INIT
  // =========================
  loadStats();
  loadReviews(true);

});
