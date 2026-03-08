// /javascripts/scripts.js

(() => {
  "use strict";

  // ============================================
  // CONFIGURATION GLOBALE
  // ============================================
  const CONFIG = {
    MOBILE_BREAKPOINT: 920,
    SCROLL_THRESHOLD: 300,
    LONG_PRESS_DURATION: 250,
    DROPDOWN_CLOSE_DELAY: 700,
    MESSAGE_DELAY: 5000,
    CHAT_BADGE_DELAY: 1500
  };

  // ============================================
  // UTILITAIRES
  // ============================================
  const isMobile = () => window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;

  const safeQuerySelector = (selector) => {
    try {
      return document.querySelector(selector);
    } catch (e) {
      console.warn(`Sélecteur invalide: ${selector}`);
      return null;
    }
  };

  // ============================================
  // 1. MOBILE MENU (BURGER)
  // ============================================
  const initMobileMenu = () => {
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (!navToggle || !navLinks) return;

    const setMenu = (open) => {
      navLinks.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    // Toggle au clic sur le burger
    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      setMenu(!navLinks.classList.contains("is-open"));
    });

    // Fermer au clic sur un lien
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        setMenu(false);
      }
    });

    // Fermer au clic hors navigation
    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("is-open")) return;
      if (!e.target.closest(".nav")) {
        setMenu(false);
      }
    });

    // Fermer avec la touche ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
        setMenu(false);
      }
    });
  };

  // ============================================
  // 2. DROPDOWN NAVIGATION
  // ============================================
  const initDropdown = () => {
    const dropdown = document.querySelector(".nav__dropdown");
    const mainLink = document.querySelector(".nav__dropdown-main");

    if (!dropdown || !mainLink) return;

    let pressTimer = null;
    let closeTimer = null;

    const openDropdown = () => {
      dropdown.classList.add("is-open", "is-peek");
    };

    const closeDropdown = (delay = 0) => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        dropdown.classList.remove("is-open", "is-peek");
      }, delay);
    };

    // Desktop: click classique
    mainLink.addEventListener("click", (e) => {
      if (!isMobile()) {
        // Laisser le lien fonctionner normalement
        return;
      }

      e.preventDefault();
      
      if (dropdown.classList.contains("is-open")) {
        closeDropdown(0);
      } else {
        openDropdown();
      }
    });

    // Mobile: long press
    mainLink.addEventListener("touchstart", (e) => {
      if (!isMobile()) return;

      clearTimeout(pressTimer);
      
      pressTimer = setTimeout(() => {
        openDropdown();
      }, CONFIG.LONG_PRESS_DURATION);
    }, { passive: true });

    mainLink.addEventListener("touchend", () => {
      if (!isMobile()) return;

      clearTimeout(pressTimer);

      if (dropdown.classList.contains("is-peek")) {
        closeDropdown(CONFIG.DROPDOWN_CLOSE_DELAY);
      }
    }, { passive: true });

    // Fermer si clic/touch en dehors
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        closeDropdown(0);
      }
    });

    document.addEventListener("touchstart", (e) => {
      if (!isMobile()) return;
      if (!dropdown.contains(e.target)) {
        closeDropdown(0);
      }
    }, { passive: true });

    // Fermer après clic sur un sous-item
    dropdown.addEventListener("click", (e) => {
      if (e.target.closest(".nav__dropdown-item")) {
        closeDropdown(0);
      }
    });
  };

  // ============================================
  // 3. BOUTON RETOUR EN HAUT
  // ============================================
  const initScrollTop = () => {
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (!scrollBtn) return;

    const toggleButton = () => {
      if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
        scrollBtn.classList.add("show");
      } else {
        scrollBtn.classList.remove("show");
      }
    };

    window.addEventListener("scroll", toggleButton, { passive: true });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    // Vérifier au chargement
    toggleButton();
  };

  // ============================================
  // 4. MODAL PLEIN ÉCRAN (IMAGE/VIDEO)
  // ============================================
  const initModal = () => {
    const exModal = document.getElementById("exModal");
    const modalContent = document.getElementById("modalContent");

    if (!exModal || !modalContent) return;

    const openModal = (html) => {
      modalContent.innerHTML = html;
      exModal.classList.add("is-open");
      exModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
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

      // Priorité: image
      const img = card.querySelector("img[data-full], .ex-card__media img[data-full]");
      if (img) {
        const src = img.getAttribute("data-full") || img.src;
        const alt = img.alt || "Aperçu";
        openModal(`<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;">`);
        return;
      }

      // Sinon: vidéo
      const video = card.querySelector("video[data-full]");
      if (video) {
        const src = video.getAttribute("data-full");
        openModal(`
          <video controls autoplay style="max-width:100%;height:auto;">
            <source src="${src}" type="video/mp4">
          </video>
        `);
      }
    });

    // Fermer avec bouton [data-close] ou backdrop
    exModal.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]") || e.target === exModal) {
        closeModal();
      }
    });

    // Fermer avec ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && exModal.classList.contains("is-open")) {
        closeModal();
      }
    });
  };

  // ============================================
  // 5. ANNÉE AUTOMATIQUE FOOTER
  // ============================================
  const initYearDisplay = () => {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  };

  // ============================================
  // 6. FORMULAIRE DEVIS
  // ============================================
  const initQuoteForm = () => {
    const form = document.getElementById("quoteForm");
    const success = document.getElementById("successMsg");

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (success) {
        success.hidden = false;
      }

      form.reset();

      setTimeout(() => {
        if (success) {
          success.hidden = true;
        }
      }, CONFIG.MESSAGE_DELAY);
    });
  };

  // ============================================
  // 7. ANIMATION TITRE HERO
  // ============================================
  const initHeroAnimation = () => {
    const title = document.querySelector(".hero__title--animate");
    
    if (!title || !("IntersectionObserver" in window)) return;

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
  };

  // ============================================
  // 8. CHATBOT WIDGET
  // ============================================
  const initChatWidget = () => {
    const toggle = document.getElementById("chatToggle");
    const widget = document.getElementById("chatWidget");
    const closeBtn = document.getElementById("chatClose");
    const badge = document.getElementById("chatBadge");
    const input = document.getElementById("cwInput");

    if (!toggle || !widget || !closeBtn) return;

    let isOpen = false;

    const ouvrirChat = () => {
      isOpen = true;
      widget.classList.add("open");
      toggle.classList.add("hidden");
      badge?.classList.remove("visible");
      input?.focus();
    };

    const fermerChat = () => {
      isOpen = false;
      widget.classList.remove("open");
      toggle.classList.remove("hidden");
    };

    // Événements
    toggle.addEventListener("click", ouvrirChat);
    closeBtn.addEventListener("click", fermerChat);

    // Fermer avec ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        fermerChat();
      }
    });

    // Message de bienvenue + badge
    setTimeout(() => {
      if (typeof afficherMessageBienvenue === "function") {
        afficherMessageBienvenue();
      }
      
      if (!isOpen && badge) {
        badge.classList.add("visible");
      }
    }, CONFIG.CHAT_BADGE_DELAY);
  };

  // ============================================
  // 9. FONCTION CONTACT BACKEND (OPTIONNEL)
  // ============================================
  const sendContactForm = async (payload) => {
    try {
      const res = await fetch("https://TON-BACKEND.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      return data;
    } catch (error) {
      console.error("Erreur sendContactForm:", error);
      throw error;
    }
  };

  // Exposer globalement si nécessaire
  window.sendContactForm = sendContactForm;

  // ============================================
  // INITIALISATION AU CHARGEMENT
  // ============================================
  document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initialisation Level Up Creation");

    initMobileMenu();
    initDropdown();
    initScrollTop();
    initModal();
    initYearDisplay();
    initQuoteForm();
    initHeroAnimation();
    initChatWidget();

    console.log("✅ Scripts chargés avec succès");
  });

  // ============================================
  // GESTION RESPONSIVE AU RESIZE
  // ============================================
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Fermer le menu mobile si on passe en desktop
      if (!isMobile()) {
        const navLinks = document.getElementById("navLinks");
        if (navLinks?.classList.contains("is-open")) {
          navLinks.classList.remove("is-open");
          document.body.style.overflow = "";
        }

        const dropdown = document.querySelector(".nav__dropdown");
        if (dropdown?.classList.contains("is-open")) {
          dropdown.classList.remove("is-open", "is-peek");
        }
      }
    }, 250);
  }, { passive: true });

})();
function openFormation(page){
    window.location.href = page;
}