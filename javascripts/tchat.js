// /javascripts/tchat.js

(() => {
  "use strict";

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    API_URL: "https://us-central1-amandinelevelupcreation.cloudfunctions.net/chatAI",
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
    TYPING_DELAY: 1200,
    MAX_MESSAGE_LENGTH: 2000
  };

  // ============================================
  // GESTION DE L'HISTORIQUE
  // ============================================
  let conversationHistory = [];
  const MAX_HISTORY = 20;

  function ajouterAuHistorique(role, content) {
    conversationHistory.push({ role, content });
    
    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    }
    
    sauvegarderHistorique();
  }

  function sauvegarderHistorique() {
    try {
      localStorage.setItem('levelup_chat_history', JSON.stringify(conversationHistory));
    } catch (e) {
      console.warn('Impossible de sauvegarder l\'historique');
    }
  }

  function chargerHistorique() {
    try {
      const saved = localStorage.getItem('levelup_chat_history');
      if (saved) {
        conversationHistory = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Impossible de charger l\'historique');
    }
  }

  // ============================================
  // ÉLÉMENTS DOM
  // ============================================
  const toggle = document.getElementById("chatToggle");
  const widget = document.getElementById("chatWidget");
  const closeBtn = document.getElementById("chatClose");
  const messages = document.getElementById("cwMessages");
  const input = document.getElementById("cwInput");
  const sendBtn = document.getElementById("cwSend");
  const badge = document.getElementById("chatBadge");

  if (!toggle || !widget || !closeBtn || !messages || !input || !sendBtn) {
    console.error("❌ Éléments du chat manquants dans le DOM");
    return;
  }

  let isOpen = false;

  // ============================================
  // UTILITAIRES
  // ============================================
  function heure() {
    return new Date().toLocaleTimeString("fr-BE", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  }

  function formatMessage(texte) {
    return texte
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.+)$/gm, "• $1")
      .replace(/^\d+\. (.+)$/gm, "<span class='list-number'>$1</span>")
      .replace(/\n/g, "<br>");
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // ============================================
  // AFFICHAGE DES MESSAGES
  // ============================================
  function ajouterMessage(texte, role) {
    retirerTyping();

    const msg = document.createElement("div");
    msg.className = `cw-msg cw-msg--${role}`;

    if (role === "bot") {
      const name = document.createElement("div");
      name.className = "cw-msg__name";
      name.textContent = "Levelia";
      msg.appendChild(name);
    }

    const bubble = document.createElement("div");
    bubble.className = "cw-msg__bubble";
    bubble.innerHTML = formatMessage(texte);
    msg.appendChild(bubble);

    const time = document.createElement("div");
    time.className = "cw-msg__time";
    time.textContent = heure();
    msg.appendChild(time);

    messages.appendChild(msg);
    scrollToBottom();

    ajouterAuHistorique(role === "bot" ? "assistant" : "user", texte);
  }

  function afficherTyping() {
    const existing = messages.querySelector(".cw-typing");
    if (existing) return;

    const el = document.createElement("div");
    el.className = "cw-typing";
    el.innerHTML = `
      <div class="cw-typing__dots">
        <span></span><span></span><span></span>
      </div>
      <div class="cw-typing__text">Levelia est en train d'écrire...</div>
    `;
    messages.appendChild(el);
    scrollToBottom();
  }

  function retirerTyping() {
    const typing = messages.querySelector(".cw-typing");
    if (typing) typing.remove();
  }

  // ============================================
  // GESTION INPUT
  // ============================================
  function desactiverInput() {
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.classList.add("loading");
  }

  function activerInput() {
    input.disabled = false;
    sendBtn.disabled = false;
    sendBtn.classList.remove("loading");
    input.focus();
  }

  // ============================================
  // ENVOI DE MESSAGE
  // ============================================
  async function envoyerMessage(retryCount = 0) {
    const texte = input.value.trim();
    
    if (!texte) return;

    if (texte.length > CONFIG.MAX_MESSAGE_LENGTH) {
      ajouterMessage(
        `⚠️ Ton message est trop long (${texte.length} caractères).\n\nMerci de le réduire à ${CONFIG.MAX_MESSAGE_LENGTH} caractères maximum.`,
        "bot"
      );
      return;
    }

    ajouterMessage(texte, "user");
    input.value = "";
    
    desactiverInput();
    afficherTyping();

    try {
      console.log("🚀 Envoi vers:", CONFIG.API_URL);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await window.fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          message: texte,
          conversationHistory: conversationHistory 
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("📡 Statut:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Erreur API:", response.status, errorData);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Réponse reçue:", data);

      retirerTyping();
      
      await new Promise(r => setTimeout(r, CONFIG.TYPING_DELAY));
      
      ajouterMessage(data.reply, "bot");

    } catch (error) {
      console.error("❌ Erreur complète:", error);

      retirerTyping();

      if (error.name === 'AbortError') {
        ajouterMessage(
          `⏱️ La requête a pris trop de temps.\n\nRéessaie ou contacte directement :\n📧 amandine@levelupcreation.com\n📞 +32 497 74 69 06`,
          "bot"
        );
        activerInput();
        return;
      }

      if (retryCount < CONFIG.MAX_RETRIES) {
        ajouterMessage(
          `⏳ Connexion instable... Nouvelle tentative (${retryCount + 1}/${CONFIG.MAX_RETRIES})`,
          "bot"
        );
        
        await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY));
        return envoyerMessage(retryCount + 1);
      }

      ajouterMessage(
        `😅 Impossible de se connecter.\n\n**Solutions :**\n\n1️⃣ Vérifie ta connexion Internet\n2️⃣ Réessaie dans quelques instants\n3️⃣ Contacte directement :\n\n📧 amandine@levelupcreation.com\n📞 +32 497 74 69 06`,
        "bot"
      );
    } finally {
      activerInput();
    }
  }

  // ============================================
  // OUVERTURE / FERMETURE
  // ============================================
  function ouvrirChat() {
    isOpen = true;
    widget.classList.add("open");
    toggle.classList.add("hidden");
    if (badge) badge.classList.remove("visible");
    input.focus();
  }

  function fermerChat() {
    isOpen = false;
    widget.classList.remove("open");
    toggle.classList.remove("hidden");
    
    // ✅ EFFACER l'historique à la fermeture
    conversationHistory = [];
    localStorage.removeItem('levelup_chat_history');
    
    // ✅ VIDER les messages affichés
    messages.innerHTML = '';
    
    // ✅ RÉAFFICHER le message de bienvenue
    setTimeout(() => {
      afficherMessageBienvenue();
    }, 100);
  }

  function effacerConversation() {
    if (confirm("Veux-tu vraiment effacer toute la conversation ?")) {
      conversationHistory = [];
      localStorage.removeItem('levelup_chat_history');
      messages.innerHTML = '';
      afficherMessageBienvenue();
    }
  }

// ============================================
// MESSAGE DE BIENVENUE
// ============================================
function afficherMessageBienvenue() {
  // Créer le message sans passer par ajouterMessage()
  const msg = document.createElement("div");
  msg.className = "cw-msg cw-msg--bot";

  const name = document.createElement("div");
  name.className = "cw-msg__name";
  name.textContent = "Levelia";
  msg.appendChild(name);

  const bubble = document.createElement("div");
  bubble.className = "cw-msg__bubble";
  bubble.innerHTML = formatMessage(
    `Hey 👋\nJe suis Levelia, ton copilote LevelUpCreation.\n\nComment puis-je t'aider aujourd'hui ? ✨`
  );
  msg.appendChild(bubble);

  const time = document.createElement("div");
  time.className = "cw-msg__time";
  time.textContent = heure();
  msg.appendChild(time);

  messages.appendChild(msg);
  scrollToBottom();
  
  // ✅ PAS d'ajout à l'historique pour éviter la boucle
}

  // ============================================
  // ÉVÉNEMENTS
  // ============================================
  toggle.addEventListener("click", ouvrirChat);
  closeBtn.addEventListener("click", fermerChat);

  const clearBtn = document.getElementById("chatClear");
  if (clearBtn) {
    clearBtn.addEventListener("click", effacerConversation);
  }

  sendBtn.addEventListener("click", () => {
    envoyerMessage();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      fermerChat();
    }
  });

  // ============================================
  // INITIALISATION
  // ============================================
  chargerHistorique();
  
  if (conversationHistory.length > 0) {
    conversationHistory.forEach(msg => {
      ajouterMessage(msg.content, msg.role === "assistant" ? "bot" : "user");
    });
  } else {
    setTimeout(() => {
      afficherMessageBienvenue();
      if (!isOpen && badge) {
        badge.classList.add("visible");
      }
    }, 1500);
  }

  console.log("✅ Chat Levelia initialisé");

})();