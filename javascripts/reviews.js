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
  // ===== DOM =====
  const form = document.getElementById("reviewForm");
  const btn = document.getElementById("reviewBtn");
  const success = document.getElementById("reviewSuccess");
  const list = document.getElementById("reviewsList");
  const avgEl = document.getElementById("avgRating");
  const countEl = document.getElementById("reviewCount");
  const hintEl = document.getElementById("reviewHint");
  const loadMoreBtn = document.getElementById("loadMoreReviews");
  const msg = document.getElementById("r_message");    // textarea
  const charCount = document.getElementById("charCount");

  if (!form) {
    console.error("[reviews] #reviewForm introuvable. Vérifie l'ID dans ton HTML.");
    return;
  }

  // ===== State =====
  let lastDocRef = null;

  // ===== UI feedback =====
  const sendingLine = document.createElement("p");
  sendingLine.className = "form__success";
  sendingLine.hidden = true;
  form.appendChild(sendingLine);

  // ===== Helpers =====
  function escapeHTML(str = "") {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  function formatDate(ts) {
    try {
      if (!ts?.toDate) return "";
      return ts.toDate().toLocaleDateString("fr-BE", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      });
    } catch {
      return "";
    }
  }

  function stars(rating = 0) {
    const r = Math.max(0, Math.min(5, Number(rating) || 0));
    return "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r);
  }

  function renderReview(d) {
    const data = d.data();
    const el = document.createElement("article");
    el.className = "review";
    el.innerHTML = `
      <div class="review__top">
        <p class="review__name">${escapeHTML(data.name || "Client")}</p>
        <p class="review__date">${formatDate(data.createdAt)}</p>
      </div>
      <div class="review__stars" aria-label="Note ${Number(data.rating || 0)}/5">
        ${stars(data.rating)}
      </div>
      <p class="review__text">${escapeHTML(data.message || "")}</p>
    `;
    return el;
  }

  function showAlertFromFirestoreError(err) {
    const message = String(err?.message || "");
    // Index requis
    if (message.includes("FAILED_PRECONDITION") && message.toLowerCase().includes("index")) {
      alert("Firestore demande un INDEX pour charger les avis.\nOuvre F12 → Console et clique sur le lien 'Create index'.");
      return;
    }
    // Permissions
    if (message.toLowerCase().includes("insufficient permissions") || message.toLowerCase().includes("permission-denied")) {
      alert("Firestore bloque l'action (rules). Vérifie Firestore → Règles.");
      return;
    }
    alert("Une erreur est survenue. Ouvre F12 → Console pour voir le détail.");
  }

  // ===== Stats (sur avis approuvés) =====
  async function loadStats() {
    if (!countEl && !avgEl && !hintEl) return;

    try {
      const qStats = query(
        collection(db, "reviews"),
        where("approved", "==", true)
      );
      const snap = await getDocs(qStats);

      const count = snap.size;
      let sum = 0;
      snap.forEach((d) => { sum += Number(d.data().rating || 0); });

      const avg = count ? (sum / count) : 0;

      if (countEl) countEl.textContent = String(count);
      if (avgEl) avgEl.textContent = count ? avg.toFixed(1) : "—";
      if (hintEl) hintEl.textContent = count
        ? "Merci pour votre confiance 💗"
        : "Soyez le/la premier(e) à laisser un avis ✨";
    } catch (err) {
      console.error("[reviews] loadStats error:", err);
      if (hintEl) hintEl.textContent = "Impossible de charger les avis.";
  
    }
  }

  // ===== List (avis approuvés) =====
  async function loadReviewsPage({ reset = false } = {}) {
    if (!list) return;

    if (reset) {
      lastDocRef = null;
      list.innerHTML = "";
    }
    if (loadMoreBtn) loadMoreBtn.hidden = true;

    try {
      const baseQ = query(
        collection(db, "reviews"),
        where("approved", "==", true),
        orderBy("createdAt", "desc"),
        limit(6)
      );

      const pageQ = lastDocRef
        ? query(
            collection(db, "reviews"),
            where("approved", "==", true),
            orderBy("createdAt", "desc"),
            startAfter(lastDocRef),
            limit(6)
          )
        : baseQ;

      const snap = await getDocs(pageQ);

      snap.forEach((d) => list.appendChild(renderReview(d)));

      lastDocRef = snap.docs[snap.docs.length - 1] || lastDocRef;

      if (loadMoreBtn) loadMoreBtn.hidden = !(snap.size === 6);
    } catch (err) {
      console.error("[reviews] loadReviewsPage error:", err);
      showAlertFromFirestoreError(err);
    }
  }

  // ===== Init =====
  async function init() {
    // compteur caractères
    if (msg && charCount) {
      charCount.textContent = String((msg.value || "").length);
      msg.addEventListener("input", () => {
        charCount.textContent = String((msg.value || "").length);
      });
    }

    await loadStats();
    await loadReviewsPage({ reset: true });
  }

  // ===== Voir plus =====
  loadMoreBtn?.addEventListener("click", () => loadReviewsPage());

  // ===== Submit =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = (form.name?.value || "").trim();
    const email = (form.email?.value || "").trim();
    const message = (form.message?.value || "").trim();
    const rating = Number(form.rating?.value || 0);

    if (!name || !message || !rating) {
      alert("Merci de remplir le nom, la note et le message.");
      return;
    }
    if (name.length < 2) {
      alert("Le nom doit contenir au moins 2 caractères.");
      return;
    }
    if (message.length < 10) {
      alert("Ton avis est un peu court 🙂 (minimum 10 caractères)");
      return;
    }
    if (message.length > 700) {
      alert("Ton avis est trop long (maximum 700 caractères).");
      return;
    }
    if (rating < 1 || rating > 5) {
      alert("Choisis une note entre 1 et 5.");
      return;
    }

    const oldText = btn?.textContent || "ENVOYER MON AVIS";
    if (btn) { btn.disabled = true; btn.textContent = "ENVOI EN COURS…"; }
    if (success) success.hidden = true;

    sendingLine.textContent = "Envoi en cours…";
    sendingLine.hidden = false;

    const watchdog = setTimeout(() => {
      sendingLine.textContent = "Toujours en cours… (connexion lente) 🙂";
    }, 4500);

    try {
    
      await addDoc(collection(db, "reviews"), {
        name,
        email: email || null,
        rating: parseInt(String(rating), 10), // int
        message,
        approved: false,
        page: window.location.href,
        createdAt: serverTimestamp()
      });

      form.reset();
      if (charCount) charCount.textContent = "0";

      if (success) {
        success.textContent = "Merci Votre avis a été envoyé et sera publié après validation.";
        success.hidden = false;
        setTimeout(() => (success.hidden = true), 7000);
      } else {
        alert("Merci Votre avis a été envoyé et sera publié après validation.");
      }

  
      await loadStats();

    } catch (err) {
      console.error("[reviews] addDoc error:", err);
      showAlertFromFirestoreError(err);
    } finally {
      clearTimeout(watchdog);
      sendingLine.hidden = true;
      if (btn) { btn.disabled = false; btn.textContent = oldText; }
    }
  });


  init();
});

const googleLink = "COLLE_ICI_TON_LIEN_AVIS_GOOGLE";

if (success) {
  success.innerHTML = `
    Merci 💗 Votre avis a été envoyé (en attente de validation).<br><br>
    <a class="btn btn--primary" href="${googleLink}" target="_blank" rel="noopener">
      Publier aussi sur Google ⭐
    </a>
  `;
  success.hidden = false;
  setTimeout(() => (success.hidden = true), 12000);
}


