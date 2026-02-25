(() => {
  // ================================================
  // CHATBOT PROFESSIONNEL — LEVEL UP CREATION
  // ================================================

  const FAQ = [
    // ── SALUTATIONS ──────────────────────────────
    {
      mots: ["bonjour", "salut", "hello", "coucou", "bonsoir", "hey", "hi"],
      reponse: `Hey 👋
Je suis Levelia, ton copilote digital.

Comment puis-je vous aider aujourd'hui ? ✨`
    },

    // ── PRISE DE NOUVELLES ──────────────────────
    {
      mots: ["comment tu vas", "tu vas bien", "quoi de neuf", "tout va bien", "comment allez vous"],
      reponse: `Merci de demander ! Je suis opérationnelle et prête à vous aider 😊

Que puis-je faire pour vous ?`
    },

    // ── QUESTION SITE WEB ────────────────────────
    {
      mots: ["je désire un site web", "je veux un site", "site web", "comment avoir un site web", "besoin d'un site", "créer un site"],
      reponse: `Ravi de l'entendre ! 🚀

Quel type de site désires-tu ?

Réponds par :

✨ **Landing page**
🌐 **Site vitrine**
🛒 **Boutique en ligne**
🎯 **Site web sur mesure**

Et je te répondrai au mieux pour t'accompagner dans ton projet.`
    },

    // ── LANDING PAGE ────────────────────────────
    {
      mots: ["landing page", "page unique", "page de vente", "one page"],
      reponse: `**Landing Page** 🎯

Une page unique ultra clean, pensée pour convertir (contact, devis, inscription, etc.).

💰 **À partir de 250€ HTVA**
📅 **Livraison :** 10 à 15 jours
📱 Design responsive (mobile & tablette)
🔍 SEO de base inclus

Idéal pour :
• Lancer un produit/service
• Capter des leads
• Événements ponctuels
• Campagnes publicitaires

Les prix peuvent varier selon la complexité du projet.`
    },

    // ── SITE VITRINE ────────────────────────────
    {
      mots: ["site vitrine", "site présentation", "plusieurs pages", "site classique", "site entreprise"],
      reponse: `**Site Vitrine** 🌐

Un site professionnel pour présenter votre activité et attirer des clients.

💰 **À partir de 500€ HTVA**
📄 Jusqu'à 7 pages
📅 **Livraison :** 15 à 30 jours
📱 Responsive design
🔍 SEO optimisé
✉️ Formulaire de contact

Parfait pour :
• Présenter votre activité
• Générer des contacts qualifiés
• Établir votre crédibilité en ligne
• Améliorer votre visibilité`
    },

    // ── BOUTIQUE EN LIGNE ──────────────────────────────
    {
      mots: ["boutique en ligne", "boutique", "e-commerce", "ecommerce", "vendre en ligne", "shop", "e-shop"],
      reponse: `**Boutique en ligne** 🛒

Vendez vos produits 24h/24 avec une boutique professionnelle et sécurisée.

💰 **À partir de 950€ HTVA**
📅 **Livraison :** 30 à 50 jours (selon nb. de produits)
🛒 Gestion des produits et stocks
💳 Paiements sécurisés
📱 Mobile-first
📊 Tableau de bord complet
🔍 SEO optimisé

Solution complète pour vendre en ligne et développer votre business.`
    },

    // ── SITE WEB SUR MESURE ─────────────────────────
    {
      mots: ["site web sur mesure", "site sur mesure", "personnalisé", "spécifique", "complexe", "sur mesure"],
      reponse: `**Votre site web sur mesure** 🎯

Un site 100% adapté à vos besoins spécifiques et à votre vision.

💰 **À partir de 750€ HTVA**
📄 7+ pages avec fonctionnalités avancées
📅 **Délai :** 30+ jours selon complexité
⚡ Entièrement personnalisé
🔧 Fonctionnalités spécifiques à votre métier
📱 Responsive et performant

Conçu pour des besoins uniques et des projets ambitieux.

Parlons de votre projet pour créer quelque chose d'unique !`
    },

    // ── FORMATION HTML ────────────────────────────
    {
      mots: ["formation html", "apprendre html", "cours html", "html débutant"],
      reponse: `**Formation HTML** 🏗️

Apprenez à créer la structure de vos pages web !

Au programme :
• Les balises HTML essentielles
• Structurer un document web
• Créer des formulaires
• Intégrer images et liens
• Les bonnes pratiques HTML5

📅 **Durée :** Adaptée à votre rythme
👤 **Format :** Individuel ou groupe
💻 **Niveau :** Débutant

📞 Pour vous inscrire ou en savoir plus :
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06`
    },

    // ── FORMATION CSS ────────────────────────────
    {
      mots: ["formation css", "apprendre css", "cours css", "css débutant"],
      reponse: `**Formation CSS** 🎨

Donnez du style à vos pages web !

Au programme :
• Les sélecteurs et propriétés CSS
• Couleurs, polices et espacements
• Le positionnement des éléments
• Flexbox et Grid
• Les animations CSS
• Design responsive

📅 **Durée :** Adaptée à votre rythme
👤 **Format :** Individuel ou groupe
💻 **Niveau :** Débutant

📞 Pour vous inscrire :
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06`
    },

    // ── FORMATION JAVASCRIPT ────────────────────────────
    {
      mots: ["formation javascript", "formation js", "apprendre javascript", "cours javascript"],
      reponse: `**Formation JavaScript** ⚡

Rendez vos sites interactifs et dynamiques !

Au programme :
• Les bases de JavaScript
• Manipuler le DOM
• Gérer les événements
• Créer des animations
• Formulaires interactifs
• Introduction aux frameworks

📅 **Durée :** Adaptée à votre rythme
👤 **Format :** Individuel ou groupe
💻 **Niveau :** Débutant à intermédiaire

📞 Pour vous inscrire :
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06`
    },

    // ── FORMATION WEB DÉVELOPPEMENT COMPLET ────────────────────────────
    {
      mots: ["formation web développement complet", "développement complet", "formation complète", "tout apprendre", "formation totale"],
      reponse: `**Formation Web Développement Complet** 🚀

La formation ultime pour devenir développeur web !

Au programme :
✅ **HTML5** - Structure
✅ **CSS3** - Design & animations
✅ **JavaScript** - Interactivité
✅ **Responsive Design**
✅ **SEO de base**
✅ **Mise en ligne**
✅ **Bonnes pratiques**

📅 **Durée :** Programme intensif personnalisé
👤 **Format :** Individuel ou groupe
💻 **Niveau :** De débutant à autonome
🎓 **Objectif :** Créer vos propres sites web

📞 Contactez-nous pour un programme sur mesure :
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06`
    },

    // ── MOTION DESIGN ────────────────────────────
    {
      mots: ["motion design", "animation", "vidéo animée", "motion", "animation graphique"],
      reponse: `**Motion Design** 🎬

Donnez vie à votre contenu avec des animations professionnelles !

Nos services :
✨ Animations logo
🎥 Vidéos explicatives
📱 Stories & posts animés
🎯 Publicités vidéo
💼 Présentations dynamiques
🎨 Génériques et transitions

💰 **À partir de 280€ HTVA**
📅 **Délai :** 15 à 20 jours

Parfait pour :
• Capter l'attention sur les réseaux
• Présenter un produit/service
• Moderniser votre communication

📞 Parlons de votre projet :
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06`
    },

    // ── DESIGN GRAPHIQUE ────────────────────────────
    {
      mots: ["design graphique", "graphisme", "logo", "identité visuelle", "charte graphique", "branding"],
      reponse: `**Design Graphique** 🎨

Créez une identité visuelle qui vous ressemble !

Nos services :
🎯 Logos professionnels
📐 Identité visuelle complète
📚 Chartes graphiques
🖼️ Visuels réseaux sociaux
📄 Supports print (flyers, cartes de visite...)
🎨 Packaging et étiquettes

💰 **À partir de 280€ HTVA**
📅 **Délai :** 15 à 20 jours

Une image de marque forte et cohérente pour vous démarquer !

📞 Contactez-nous :
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06`
    },

    // ── VOTRE DESIGN SUR MESURE ────────────────────────────
    {
      mots: ["votre design sur mesure", "design sur mesure", "design personnalisé", "branding complet", "design premium"],
      reponse: `**Votre Design Sur Mesure** 🏆

Une identité visuelle 100% unique, pensée pour votre marque.

Inclus :
✅ Analyse de votre univers et valeurs
✅ Création de logo premium
✅ Charte graphique complète
✅ Déclinaisons tous supports
✅ Kit réseaux sociaux
✅ Templates personnalisés
✅ Guide d'utilisation

💰 **À partir de 450€ HTVA**
📅 **Délai :** 30+ jours
🎯 Stratégie de marque incluse

Pour une identité forte, mémorable et cohérente.

📞 Créons ensemble votre image de marque :
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06`
    },

    // ── RÉPONSE POSITIVE ────────────────────────
    {
      mots: ["je vais bien", "heureux", "heureuse", "content", "contente", "ravi", "ca va", "super bien", "top", "nickel"],
      reponse: `Ravi de l'entendre ! 😊

Comment puis-je vous accompagner aujourd'hui ?`
    },

    // ── RÉPONSE NÉGATIVE ────────────────────────
    {
      mots: ["pas bien", "mal", "triste", "déprimé", "déçu", "frustré", "stressé", "anxieux", "bof", "difficile"],
      reponse: `Je suis désolée d'apprendre cela.

Si je peux vous aider avec votre projet web ou design, ce sera avec plaisir. En quoi puis-je vous être utile ?`
    },

    // ── AMANDINE ────────────────────────────────
    {
      mots: ["amandine", "fondatrice", "créatrice", "qui êtes vous", "dirigeante"],
      reponse: `**Amandine Letellier** est la fondatrice et développeuse web de Level Up Creation.

Passionnée par le développement web, elle accompagne les entrepreneurs dans la création de leur présence digitale.`
    },

    // ── JONATHAN ────────────────────────────────
    {
      mots: ["jonathan", "designer", "graphiste", "motion design", "qui fait le design"],
      reponse: `**Jonathan** est notre designer graphique et motion designer.

Il s'occupe de toute la partie visuelle : logos, identité de marque, animations, montages vidéo...`
    },

    // ── LE STUDIO ───────────────────────────────
    {
      mots: ["level up", "studio", "agence", "à propos", "votre agence", "présentation"],
      reponse: `**Level Up Creation** est un studio digital belge spécialisé dans la création de sites web sur-mesure et le design graphique.

Notre philosophie :
✓ Design premium et moderne
✓ 100% personnalisé selon votre marque
✓ Sites performants et optimisés
✓ Accompagnement complet
✓ Transparence des prix
✓ Livraison rapide

Nous créons des sites qui convertissent et des designs qui marquent les esprits.`
    },

    // ── DEVIS ───────────────────────────────────
    {
      mots: ["devis", "estimation", "gratuit", "combien", "budget", "tarification"],
      reponse: `Pour recevoir un **devis personnalisé** :

📧 Contactez-nous via le formulaire sur notre site
📞 Appelez au +32 497 74 69 06
✉️ Écrivez à amandine@levelupcreation.com

**Le devis est 100% gratuit et sans engagement.**

Nous analysons votre projet et vous proposons une solution adaptée à vos besoins et votre budget.`
    },

    // ── SERVICES GLOBAUX ────────────────────────
    {
      mots: ["services", "prestations", "offres", "que faites vous", "proposez"],
      reponse: `**Nos services :**

🌐 **SITES WEB**
• Landing page
• Site vitrine
• Boutique en ligne
• Site web sur mesure

🎨 **DESIGN**
• Design graphique
• Motion design
• Votre design sur mesure

📚 **FORMATIONS**
• Formation HTML
• Formation CSS
• Formation JavaScript
• Formation Web Développement Complet

Quel service vous intéresse ?`
    },

    // ── TARIFS GLOBAUX ──────────────────────────
    {
      mots: ["tarifs", "prix", "coût", "combien", "budget", "grille tarifaire"],
      reponse: `**Nos tarifs en un coup d'œil :**

🌐 **SITES WEB**
• Landing Page : dès 250€ HTVA
• Site Vitrine : dès 500€ HTVA
• Boutique en ligne : dès 950€ HTVA
• Site web sur mesure : dès 750€ HTVA

🎨 **DESIGN**
• Design graphique : dès 280€ HTVA
• Motion design : dès 280€ HTVA
• Votre design sur mesure : dès 450€ HTVA

✅ Prix clairs, sans frais cachés
✅ Devis gratuit et personnalisé

Contactez-nous pour un devis adapté à votre projet.`
    },

    // ── DÉLAIS ──────────────────────────────────
    {
      mots: ["délai", "temps", "durée", "livraison", "combien de temps", "rapide"],
      reponse: `**Délais de livraison :**

⏱️ **Landing Page** : 10-15 jours
⏱️ **Site Vitrine** : 15-30 jours
⏱️ **Boutique en ligne** : 30-50 jours
⏱️ **Site web sur mesure** : 30+ jours
⏱️ **Design Graphique / Motion** : 15-20 jours
⏱️ **Votre design sur mesure** : 30+ jours

Ces délais démarrent après validation du projet et réception de tous les éléments (textes, images, contenus).`
    },

    // ── CONTACT ─────────────────────────────────
    {
      mots: ["contact", "joindre", "email", "téléphone", "appeler", "écrire", "coordonnées"],
      reponse: `**Nous contacter :**

📧 **Email :** amandine@levelupcreation.com
📞 **Téléphone / WhatsApp :** +32 497 74 69 06
💬 **Formulaire** : sur notre site web

⏰ Amandine répond généralement sous **24h en semaine**.

Les demandes sont traitées dans l'ordre d'arrivée. Merci de votre patience !`
    },

    // ── REMERCIEMENTS ───────────────────────────
    {
      mots: ["merci", "super", "parfait", "génial", "top", "cool", "nickel", "excellent"],
      reponse: `Avec plaisir ! 😊

Si vous avez d'autres questions sur Level Up Creation, je reste à votre disposition.

Bonne continuation ! ✨`
    },

    // ── AU REVOIR ───────────────────────────────
    {
      mots: ["au revoir", "bye", "bonne journée", "bonne soirée", "à bientôt", "ciao", "salut"],
      reponse: `À très bientôt ! 👋

N'hésitez pas à revenir si vous avez des questions.

Belle journée à vous ! ✨`
    },

    // ── HORS SUJET ──────────────────────────────
    {
      mots: ["météo", "sport", "foot", "recette", "cuisine", "film", "musique", "jeu vidéo", "politique"],
      reponse: `Je suis désolée, cette question sort de mon domaine de compétence 😊

Je suis spécialisée dans **Level Up Creation** et je peux vous aider sur :
• Nos services web et design
• Nos formations
• Nos tarifs et processus
• Comment nous contacter

Avez-vous une question dans l'un de ces domaines ?`
    }
  ];

  const REPONSE_DEFAULT = `Je n'ai pas compris votre question 😊

Je peux vous renseigner sur :

🌐 **Sites Web :** Landing page, Site vitrine, Boutique en ligne, Site web sur mesure
🎨 **Design :** Design graphique, Motion design, Votre design sur mesure
📚 **Formations :** HTML, CSS, JavaScript, Web Développement Complet

Pourriez-vous reformuler votre question ?

Ou contactez directement Amandine :
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06`;

  // ── FONCTION DE MATCHING ────────────────────
  function reponseBot(message) {
    const msg = message
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    for (const item of FAQ) {
      if (item.mots.some(mot => msg.includes(mot))) {
        return item.reponse;
      }
    }
    return REPONSE_DEFAULT;
  }

  // ── GESTION DU DOM ──────────────────────────
  const toggle = document.getElementById("chatToggle");
  const widget = document.getElementById("chatWidget");
  const closeBtn = document.getElementById("chatClose");
  const messages = document.getElementById("cwMessages");
  const input = document.getElementById("cwInput");
  const sendBtn = document.getElementById("cwSend");
  const badge = document.getElementById("chatBadge");

  let isOpen = false;

  function heure() {
    return new Date().toLocaleTimeString("fr-BE", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  }

  function ajouterMessage(texte, estBot) {
    const typing = messages.querySelector(".cw-typing");
    if (typing) typing.remove();

    const msg = document.createElement("div");
    msg.className = `cw-msg ${estBot ? "cw-msg--bot" : "cw-msg--user"}`;

    if (estBot) {
      const name = document.createElement("div");
      name.className = "cw-msg__name";
      name.textContent = "Levelia";
      msg.appendChild(name);
    }

    const bubble = document.createElement("div");
    bubble.className = "cw-msg__bubble";
    
    bubble.innerHTML = texte
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
    
    msg.appendChild(bubble);

    const time = document.createElement("div");
    time.className = "cw-msg__time";
    time.textContent = heure();
    msg.appendChild(time);

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function afficherTyping() {
    const typing = messages.querySelector(".cw-typing");
    if (typing) return;
    
    const el = document.createElement("div");
    el.className = "cw-typing visible";
    el.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  async function envoyerMessage() {
    const texte = input.value.trim();
    if (!texte) return;

    input.value = "";
    ajouterMessage(texte, false);
    afficherTyping();

    await new Promise(r => setTimeout(r, 1200));
    ajouterMessage(reponseBot(texte), true);
  }

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

  toggle.addEventListener("click", () => {
    isOpen ? fermerChat() : ouvrirChat();
  });

  closeBtn.addEventListener("click", fermerChat);
  sendBtn.addEventListener("click", envoyerMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      envoyerMessage();
    }
  });

  // ── MESSAGE DE BIENVENUE ────────────────────
  setTimeout(() => {
    ajouterMessage(
      `Hey 👋
Je suis Levelia, ton copilote digital.

Comment puis-je vous aider aujourd'hui ? ✨`,
      true
    );
    
    if (!isOpen) {
      badge.classList.add("visible");
    }
  }, 1500);
})();