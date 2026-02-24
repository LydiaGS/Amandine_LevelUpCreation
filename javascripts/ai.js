const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const fetch = require("node-fetch");

const openaiKey = defineSecret("OPENAI_KEY");

exports.chatAI = onRequest(
  {
    cors: ["https://levelupcreation.com", "http://localhost:3000"], // Dev + Prod
    secrets: [openaiKey],
    timeoutSeconds: 60,
    memory: "256MiB"
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message invalide" });
      }

      // 🔒 Limitation anti-spam
      if (message.length > 2000) {
        return res.status(400).json({ 
          error: "Message trop long (max 2000 caractères)" 
        });
      }

      // 📚 Construction de l'historique avec limite
      const messages = [
        {
          role: "system",
          content: `Tu es l'assistante virtuelle premium de Level Up Creation, agence digitale belge spécialisée en création de sites web.

## 🎯 TON RÔLE
- Accompagner les visiteurs avec professionnalisme et chaleur
- Répondre précisément aux questions sur Level Up Creation
- Guider vers les solutions adaptées
- Donner des conseils web pertinents

## 📋 DOMAINES DE COMPÉTENCE

### SERVICES
**Sites Web :**
- Landing Page : dès 250€ HTVA (10-15j)
- Site Vitrine : dès 500€ HTVA (15-30j) - jusqu'à 7 pages
- E-commerce : dès 950€ HTVA (30-50j)
- Sur-mesure : dès 750€ HTVA (30j+)
- Page supplémentaire : 100€ HTVA

**Design & Motion :**
- Design graphique : dès 280€ HTVA (15-20j)
- Branding premium : dès 450€ HTVA (30j+)
- Logos, chartes graphiques, animations

**Formation :**
- "Les bases du développement web" (HTML, CSS, JavaScript)

### ÉQUIPE
- **Amandine Letellier** : Fondatrice & développeuse web passionnée
- **Jonathan** : Designer graphique & motion designer

### PROCESSUS
1. Écoute & analyse de vos besoins
2. Création de maquettes personnalisées
3. Développement & optimisations
4. Mise en ligne & formation

### CONTACT
- 📧 amandine@levelupcreation.com
- 📞 +32 497 74 69 06
- 📍 Bruxelles, Belgique
- 🕘 Rendez-vous : 9h30-12h / 13h-16h30

### RÉSEAUX
- TikTok : @levelupcreation
- Instagram : @level_upcreation
- LinkedIn : Level Up Creation

### AVANTAGES
✓ Design premium et moderne
✓ 100% sur-mesure
✓ SEO & performances optimisées
✓ Accompagnement complet
✓ Tarifs transparents
✓ Devis gratuit

## 💡 CONSEILS DÉVELOPPEMENT WEB

**HTML** : Langage de structure (titres, textes, images, liens)
**CSS** : Langage de style (couleurs, polices, espacements, animations)
**JavaScript** : Langage d'interactivité (actions, menus, formulaires)

## ✍️ TON STYLE
- **Ton** : Professionnel, chaleureux, rassurant, premium
- **Tu tutoies** avec bienveillance
- **Tu structures** tes réponses (titres, listes, emojis pertinents)
- **Tu es concis** mais complet
- **Tu rediriges** vers le contact pour les demandes spécifiques

## 🚫 LIMITES
- Tu ne réponds QUE sur Level Up Creation et le développement web
- Tu ne fais PAS de code
- Tu ne donnes PAS de conseils hors sujet
- Tu rediriges poliment les questions hors périmètre

## 📞 APPEL À L'ACTION
Propose toujours un moyen de contact concret : devis gratuit, échange téléphonique, formulaire.

Sois l'assistante parfaite : efficace, humaine et professionnelle. 🌟`
        },
        // Historique limité aux 10 derniers messages
        ...conversationHistory.slice(-10),
        {
          role: "user",
          content: message
        }
      ];

      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey.value()}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0.8,
          max_tokens: 1000,
          top_p: 0.9,
          frequency_penalty: 0.3,
          presence_penalty: 0.2,
          // Améliore la cohérence et réduit les répétitions
        })
      });

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const data = await openaiResponse.json();

      res.json({
        reply: data.choices[0].message.content.trim(),
        usage: data.usage // Pour monitoring
      });

    } catch (error) {
      console.error("❌ Erreur ChatAI:", error);
      
      res.status(500).json({
        reply: "Je rencontre un petit souci technique 😅\n\nPeux-tu réessayer dans quelques secondes ?\n\nSi le problème persiste, contacte directement Amandine :\n📧 amandine@levelupcreation.com\n📞 +32 497 74 69 06"
      });
    }
  }
);
(() => {
  // ── CONFIGURATION ────────────────────────────
  const CONFIG = {
    API_URL: "https://us-central1-amandinelevelupcreation.cloudfunctions.net/chatAI",
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
    TYPING_DELAY: 1500,
    MAX_MESSAGE_LENGTH: 2000
  };

  // ── GESTION DE L'HISTORIQUE ─────────────────
  let conversationHistory = [];
  const MAX_HISTORY = 20; // Limite mémoire

  function ajouterAuHistorique(role, content) {
    conversationHistory.push({ role, content });
    
    // Limiter l'historique
    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    }
    
    // Sauvegarder en localStorage
    sauvegarderHistorique();
  }

  function sauvegarderHistorique() {
    try {
      localStorage.setItem('chat_history', JSON.stringify(conversationHistory));
    } catch (e) {
      console.warn('Impossible de sauvegarder l\'historique');
    }
  }

  function chargerHistorique() {
    try {
      const saved = localStorage.getItem('chat_history');
      if (saved) {
        conversationHistory = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Impossible de charger l\'historique');
    }
  }

  // ── DOM ──────────────────────────────────────
  const toggle = document.getElementById("chatToggle");
  const widget = document.getElementById("chatWidget");
  const closeBtn = document.getElementById("chatClose");
  const clearBtn = document.getElementById("chatClear");
  const messages = document.getElementById("cwMessages");
  const input = document.getElementById("cwInput");
  const sendBtn = document.getElementById("cwSend");
  const badge = document.getElementById("chatBadge");
  const charCount = document.getElementById("charCount");

  let isOpen = false;

  // ── UTILITAIRES ──────────────────────────────
  function heure() {
    return new Date().toLocaleTimeString("fr-BE", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  }

  function formatMessage(texte) {
    return texte
      // Gras
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Liens
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Listes
      .replace(/^- (.+)$/gm, "• $1")
      .replace(/^\d+\. (.+)$/gm, "<span class='list-number'>$1</span>")
      // Retours à la ligne
      .replace(/\n/g, "<br>");
  }

  function ajouterMessage(texte, role) {
    retirerTyping();

    const msg = document.createElement("div");
    msg.className = `cw-msg cw-msg--${role}`;

    if (role === "bot") {
      const name = document.createElement("div");
      name.className = "cw-msg__name";
      name.textContent = "Level Up Creation";
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

    // Ajouter à l'historique
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
      <div class="cw-typing__text">Level Up Creation est en train d'écrire...</div>
    `;
    messages.appendChild(el);
    scrollToBottom();
  }

  function retirerTyping() {
    const typing = messages.querySelector(".cw-typing");
    if (typing) typing.remove();
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function desactiverInput() {
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span class="loader"></span>';
  }

  function activerInput() {
    input.disabled = false;
    sendBtn.disabled = false;
    sendBtn.innerHTML = '📤';
    input.focus();
  }

  // ── ENVOI DE MESSAGE AVEC RETRY ─────────────
  async function envoyerMessage(retryCount = 0) {
    const texte = input.value.trim();
    
    if (!texte) return;

    // Validation longueur
    if (texte.length > CONFIG.MAX_MESSAGE_LENGTH) {
      ajouterMessage(
        `⚠️ Ton message est trop long (${texte.length} caractères).\n\nMerci de le réduire à ${CONFIG.MAX_MESSAGE_LENGTH} caractères maximum.`,
        "bot"
      );
      return;
    }

    // Afficher message utilisateur
    ajouterMessage(texte, "user");
    input.value = "";
    updateCharCount();
    
    desactiverInput();
    afficherTyping();

    try {
      const response = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          message: texte,
          conversationHistory: conversationHistory 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      retirerTyping();
      
      // Simulation de typing pour effet naturel
      await new Promise(r => setTimeout(r, CONFIG.TYPING_DELAY));
      
      ajouterMessage(data.reply, "bot");

    } catch (error) {
      console.error("Erreur:", error);

      retirerTyping();

      // Retry automatique
      if (retryCount < CONFIG.MAX_RETRIES) {
        ajouterMessage(
          `⏳ Connexion instable... Nouvelle tentative (${retryCount + 1}/${CONFIG.MAX_RETRIES})`,
          "bot"
        );
        
        await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY));
        return envoyerMessage(retryCount + 1);
      }

      // Échec final
      ajouterMessage(
        `😅 Je n'arrive pas à me connecter en ce moment.\n\n**Solutions :**\n\n1️⃣ Vérifie ta connexion Internet\n2️⃣ Réessaie dans quelques instants\n3️⃣ Contacte directement Amandine :\n\n📧 amandine@levelupcreation.com\n📞 +32 497 74 69 06`,
        "bot"
      );
    } finally {
      activerInput();
    }
  }

  // ── COMPTEUR DE CARACTÈRES ──────────────────
  function updateCharCount() {
    const count = input.value.length;
    charCount.textContent = `${count}/${CONFIG.MAX_MESSAGE_LENGTH}`;
    
    if (count > CONFIG.MAX_MESSAGE_LENGTH) {
      charCount.classList.add('error');
    } else if (count > CONFIG.MAX_MESSAGE_LENGTH * 0.9) {
      charCount.classList.add('warning');
      charCount.classList.remove('error');
    } else {
      charCount.classList.remove('warning', 'error');
    }
  }

  // ── EFFACER LA CONVERSATION ─────────────────
  function effacerConversation() {
    if (confirm("Veux-tu vraiment effacer toute la conversation ?")) {
      conversationHistory = [];
      localStorage.removeItem('chat_history');
      
      // Garder seulement le message de bienvenue
      messages.innerHTML = '';
      afficherMessageBienvenue();
    }
  }

  // ── OUVERTURE / FERMETURE ───────────────────
  function ouvrirChat() {
    isOpen = true;
    widget.classList.add("open");
    badge.classList.remove("visible");
    input.focus();
  }

  function fermerChat() {
    isOpen = false;
    widget.classList.remove("open");
  }

  // ── MESSAGE DE BIENVENUE ────────────────────
  function afficherMessageBienvenue() {
    ajouterMessage(
      `Bonjour ! 👋

Je suis l'assistante virtuelle de **Level Up Creation**.

Je peux t'aider avec :
• Nos services web & design
• Les tarifs et délais
• Notre processus de travail
• Les formations développement
• Des conseils techniques

**Pose-moi ta question, je suis là pour toi !** ✨`,
      "bot"
    );
  }

  // ── ÉVÉNEMENTS ──────────────────────────────
  toggle.addEventListener("click", () => {
    isOpen ? fermerChat() : ouvrirChat();
  });

  closeBtn.addEventListener("click", fermerChat);
  
  if (clearBtn) {
    clearBtn.addEventListener("click", effacerConversation);
  }

  sendBtn.addEventListener("click", () => envoyerMessage());

  input.addEventListener("input", updateCharCount);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  });

  // ── INITIALISATION ──────────────────────────
  chargerHistorique();
  
  // Afficher l'historique au chargement
  if (conversationHistory.length > 0) {
    conversationHistory.forEach(msg => {
      ajouterMessage(msg.content, msg.role === "assistant" ? "bot" : "user");
    });
  } else {
    // Premier chargement
    setTimeout(() => {
      afficherMessageBienvenue();
      if (!isOpen) badge.classList.add("visible");
    }, 1500);
  }

  updateCharCount();
})();