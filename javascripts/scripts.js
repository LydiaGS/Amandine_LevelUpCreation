// Mobile menu
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  if (!navLinks || !navToggle) return;
  navLinks.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
}

navToggle?.addEventListener("click", () => {
  setMenu(!navLinks.classList.contains("is-open"));
});

navLinks?.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});

// To top
const toTop = document.getElementById("toTop");

function updateToTop() {
  if (!toTop) return;
  const show = window.scrollY > 300;
  toTop.classList.toggle("is-visible", show);
}

window.addEventListener("scroll", updateToTop, { passive: true });
updateToTop();

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");

function openModal(src, alt) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modalImg.src = src;
  modalImg.alt = alt || "Aperçu plein écran";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalImg.removeAttribute("src");
  document.body.style.overflow = "";
}

// Open from any card button
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open]");
  if (!btn) return;

  const card = btn.closest(".ex-card");
  const img = card?.querySelector("img");
  if (!img) return;

  openModal(img.dataset.full || img.src, img.alt);
});

// Close (backdrop or close btn)
document.addEventListener("click", (e) => {
  if (!modal.classList.contains("is-open")) return;
  if (e.target.closest("[data-close]")) closeModal();
});

// ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});
document.getElementById("year").textContent = new Date().getFullYear();
  const form = document.getElementById("quoteForm");
      const success = document.getElementById("successMsg");
      form?.addEventListener("submit", (e) => {
        e.preventDefault();
        success.hidden = false;
        form.reset();
        setTimeout(() => (success.hidden = true), 5000);
      });
      document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".hero__title--animate");

  if (!title) return;

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
});
document.addEventListener("DOMContentLoaded", () => {
  const openButtons = document.querySelectorAll("[data-modal-open]");
  const modals = document.querySelectorAll(".pmodal");

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = (modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openButtons.forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.modalOpen));
  });

  modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-modal-close]")) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const opened = document.querySelector(".pmodal.is-open");
    if (opened) closeModal(opened);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("exModal");
  const content = document.getElementById("modalContent");

  if (!modal || !content) return;

  const openModal = (html) => {
    content.innerHTML = html;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    content.innerHTML = "";
    document.body.style.overflow = "";
  };

  // OUVERTURE au clic sur bouton data-open
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".ex-card");
      if (!card) return;

      // Priorité : IMG
      const img = card.querySelector(".ex-card__media img[data-full]");
      if (img) {
        const src = img.getAttribute("data-full") || img.src;
        openModal(`<img src="${src}" alt="${img.alt || "Aperçu"}">`);
        return;
      }

      // Sinon : VIDEO
      const video = card.querySelector("video[data-full]");
      if (video) {
        const src = video.getAttribute("data-full");
        openModal(`
          <video controls autoplay>
            <source src="${src}" type="video/mp4">
          </video>
        `);
        return;
      }
    });
  });

  // FERMETURE (croix + backdrop)
  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
  });

  // ESC pour fermer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
});
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
document.addEventListener("DOMContentLoaded", () => {

  const openButtons = document.querySelectorAll("[data-open]");

  openButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      
      const card = btn.closest(".ex-card");
      if (!card) return;

      card.classList.add("ex-card--fullscreen");

      // Création bouton fermeture
      if (!card.querySelector(".ex-card__close")) {
        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "✕";
        closeBtn.className = "ex-card__close";
        card.appendChild(closeBtn);

        closeBtn.addEventListener("click", () => {
          card.classList.remove("ex-card--fullscreen");
          closeBtn.remove();
        });
      }

    });
  });

  // Fermer avec ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const active = document.querySelector(".ex-card--fullscreen");
      if (active) {
        active.classList.remove("ex-card--fullscreen");
        const closeBtn = active.querySelector(".ex-card__close");
        if (closeBtn) closeBtn.remove();
      }
    }
  });

});