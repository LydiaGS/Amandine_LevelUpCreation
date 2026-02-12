// /javascripts/scripts.js
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // 1) MOBILE MENU (BURGER)
    // =========================
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
      const setMenu = (open) => {
        navLinks.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      };

      navToggle.addEventListener("click", (e) => {
        e.preventDefault();
        setMenu(!navLinks.classList.contains("is-open"));
      });

      // Fermer au clic sur un lien
      navLinks.addEventListener("click", (e) => {
        if (e.target.closest("a")) setMenu(false);
      });

      // Fermer au clic hors nav
      document.addEventListener("click", (e) => {
        if (!navLinks.classList.contains("is-open")) return;
        if (!e.target.closest(".nav")) setMenu(false);
      });

      // Fermer avec ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setMenu(false);
      });
    }

    // =========================
    // 2) BOUTON "RETOUR EN HAUT"
    // =========================
    const toTop = document.getElementById("toTop");

    if (toTop) {
      const updateToTop = () => {
        const show = window.scrollY > 300;
        toTop.classList.toggle("is-visible", show);
      };

      window.addEventListener("scroll", updateToTop, { passive: true });
      updateToTop();

      toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // =========================
    // 3) MODAL "PLEIN ÉCRAN" (IMG/VIDEO)
    //    HTML attendu:
    //    - <div id="exModal" class="modal" aria-hidden="true">
    //        <button data-close>...</button>
    //        <div id="modalContent"></div>
    //      </div>
    //    - boutons: <button data-open>...</button>
    //    - carte: .ex-card (contient img[data-full] ou video[data-full])
    // =========================
    const exModal = document.getElementById("exModal");
    const modalContent = document.getElementById("modalContent");

    const isModalReady = !!(exModal && modalContent);

    const openExModal = (html) => {
      if (!isModalReady) return;
      modalContent.innerHTML = html;
      exModal.classList.add("is-open");
      exModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeExModal = () => {
      if (!isModalReady) return;
      exModal.classList.remove("is-open");
      exModal.setAttribute("aria-hidden", "true");
      modalContent.innerHTML = "";
      document.body.style.overflow = "";
    };

    // Ouvrir au clic sur [data-open]
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open]");
      if (!btn) return;

      const card = btn.closest(".ex-card");
      if (!card) return;

      // Image priorité
      const img = card.querySelector("img[data-full], .ex-card__media img[data-full]");
      if (img) {
        const src = img.getAttribute("data-full") || img.src;
        openExModal(`<img src="${src}" alt="${img.alt || "Aperçu"}" style="max-width:100%;height:auto;">`);
        return;
      }

      // Vidéo
      const video = card.querySelector("video[data-full]");
      if (video) {
        const src = video.getAttribute("data-full");
        openExModal(`
          <video controls autoplay style="max-width:100%;height:auto;">
            <source src="${src}" type="video/mp4">
          </video>
        `);
      }
    });

    // Fermer (croix / backdrop)
    if (isModalReady) {
      exModal.addEventListener("click", (e) => {
        if (e.target.closest("[data-close]")) closeExModal();
      });
    }

    // ESC ferme modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isModalReady && exModal.classList.contains("is-open")) {
        closeExModal();
      }
    });

    // =========================
    // 4) ANNÉE AUTO DANS FOOTER
    // =========================
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // =========================
    // 5) FORMULAIRE DEVIS (quoteForm)
    // =========================
    const form = document.getElementById("quoteForm");
    const success = document.getElementById("successMsg");

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (success) success.hidden = false;
      form.reset();
      setTimeout(() => {
        if (success) success.hidden = true;
      }, 5000);
    });

    // =========================
    // 6) ANIMATION TITRE HERO (IntersectionObserver)
    // =========================
    const title = document.querySelector(".hero__title--animate");
    if (title && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            title.classList.add("is-visible");
            observer.disconnect();
          }
        },
        { threshold: 0.4 }
      );

      observer.observe(title);
    }
  });

  // =========================
  // 7) (OPTIONNEL) Contact backend (à appeler depuis un form)
  // =========================
  async function sendContactForm(payload) {
    const res = await fetch("https://TON-BACKEND.onrender.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || "Erreur");
    return data;
  }

  // expose si tu en as besoin ailleurs
  window.sendContactForm = sendContactForm;
})();
