(() => {
  // ================================================
  // CHATBOT PROFESSIONNEL — LEVEL UP CREATION
  // ================================================

  const FAQ = [
    // ── SALUTATIONS ──────────────────────────────
    {
      mots: ["bonjour", "salut", "hello", "coucou", "bonsoir", "hey", "hi"],
      reponse: `Bonjour ! 👋

Je suis l'assistante virtuelle de Level Up Creation.

Je peux vous renseigner sur :
• Nos services (sites web, design, formations)
• Nos tarifs et délais
• Notre processus de travail
• Comment nous contacter

Comment puis-je vous aider aujourd'hui ? ✨`
    },

    // ── PRISE DE NOUVELLES ──────────────────────
    {
      mots: ["comment tu vas", "tu vas bien", "quoi de neuf", "tout va bien", "comment allez vous"],
      reponse: `Merci de demander ! Je suis opérationnelle et prête à vous aider 😊

Que puis-je faire pour vous ?`
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

Si je peux vous aider avec votre projet web, ce sera avec plaisir. En quoi puis-je vous être utile ?`
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
      reponse: `**Level Up Creation** est un studio digital belge spécialisé dans la création de sites web sur-mesure.

Notre philosophie :
✓ Design premium et moderne
✓ 100% personnalisé selon votre marque
✓ Sites performants et optimisés
✓ Accompagnement complet
✓ Transparence des prix
✓ Livraison rapide

Nous créons des sites qui convertissent, pas des sites vitrines ordinaires.`
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

    // ── POURQUOI NOUS ───────────────────────────
    {
      mots: ["pourquoi vous", "avantages", "différence", "points forts", "distingue"],
      reponse: `**Pourquoi choisir Level Up Creation ?**

1️⃣ **Design Premium**
Des sites modernes, élégants et professionnels

2️⃣ **100% Sur-mesure**
Chaque section pensée pour votre marque

3️⃣ **Optimisation maximale**
SEO, performances, mobile-first

4️⃣ **Accompagnement complet**
Support et conseils même après livraison

5️⃣ **Tarifs transparents**
Pas de frais cachés, tout est clair dès le départ

6️⃣ **Livraison rapide**
Votre site en ligne en quelques semaines`
    },

    // ── PROCESSUS ───────────────────────────────
    {
      mots: ["processus", "comment ça marche", "étapes", "déroulement", "méthode"],
      reponse: `**Notre processus en 4 étapes :**

**1. Écoute & Analyse** 🎯
Nous définissons ensemble vos objectifs et votre vision

**2. Maquette Personnalisée** 🎨
Création du design sur-mesure aligné à votre marque

**3. Intégration & Développement** ⚙️
Codage, optimisations et tests approfondis

**4. Mise en ligne & Suivi** 🚀
Livraison + formation + accompagnement

Tout commence par un **échange gratuit** pour comprendre votre projet.`
    },

    // ── SERVICES GLOBAUX ────────────────────────
    {
      mots: ["services", "prestations", "offres", "que faites vous", "proposez"],
      reponse: `**Nos services :**

🌐 **SITES WEB**
• Landing pages
• Sites vitrines
• E-commerce
• Sites sur-mesure

🎨 **DESIGN GRAPHIQUE & MOTION**
• Logos & identité visuelle
• Chartes graphiques
• Animations & motion design
• Montages vidéo

📚 **FORMATIONS**
• Les bases du développement web

Quel service vous intéresse ?`
    },

    // ── LANDING PAGE ────────────────────────────
    {
      mots: ["landing page", "page unique", "page de vente", "one page"],
      reponse: `**Landing Page**

💰 **À partir de 250€ HTVA**

📅 Livraison : 10 à 15 jours
📱 Design responsive (mobile & tablette)
🔍 SEO de base inclus

Idéal pour :
• Lancer un produit/service
• Capter des leads
• Événements ponctuels`
    },

    // ── SITE VITRINE ────────────────────────────
    {
      mots: ["site vitrine", "site présentation", "plusieurs pages", "site classique", "site entreprise"],
      reponse: `**Site Vitrine**

💰 **À partir de 500€ HTVA**

📄 Jusqu'à 7 pages
📅 Livraison : 15 à 30 jours
📱 Responsive design
🔍 SEO optimisé

Parfait pour :
• Présenter votre activité
• Générer des contacts qualifiés
• Établir votre crédibilité en ligne`
    },

    // ── E-COMMERCE ──────────────────────────────
    {
      mots: ["boutique", "e-commerce", "ecommerce", "vendre en ligne", "shop", "e-shop"],
      reponse: `**Boutique en ligne / E-commerce**

💰 **À partir de 950€ HTVA**

📅 Livraison : 30 à 50 jours (selon nb. de produits)
🛒 Gestion des produits et stocks
💳 Paiements sécurisés
📱 Mobile-first
📊 Tableau de bord complet

Solution complète pour vendre vos produits en ligne.`
    },

    // ── SITE SUR MESURE ─────────────────────────
    {
      mots: ["sur mesure", "personnalisé", "spécifique", "complexe"],
      reponse: `**Site Web Sur-Mesure**

💰 **À partir de 750€ HTVA**

📄 7+ pages avec fonctionnalités avancées
📅 Délai : 30+ jours selon complexité
⚡ Entièrement personnalisé
🔧 Fonctionnalités spécifiques

Conçu pour des besoins uniques et des projets ambitieux.`
    },

    // ── DESIGN GRAPHIQUE ────────────────────────
    {
      mots: ["design graphique", "motion design", "logo", "identité visuelle", "charte", "branding"],
      reponse: `**Design Graphique & Motion Design**

💰 **À partir de 280€ HTVA**

📅 Livraison : 15 à 20 jours
🎨 Design professionnel
📐 Tous supports (print, web, réseaux)

Nos prestations :
• Logos
• Identité visuelle complète
• Chartes graphiques
• Motion design & animations
• Montage vidéo
• Retouches photo`
    },

    // ── DESIGN SUR MESURE ───────────────────────
    {
      mots: ["design premium", "design complet", "branding complet"],
      reponse: `**Design Sur-Mesure / Branding Premium**

💰 **À partir de 450€ HTVA**

📅 Livraison : 30+ jours
🏆 Identité visuelle complète
📋 Charte graphique détaillée
🎯 Stratégie de marque

Pour une identité forte et cohérente sur tous vos supports.`
    },

    // ── FORMATION ───────────────────────────────
    {
      mots: ["formation", "apprendre", "cours", "développement web", "bases", "débutant"],
      reponse: `**Formation : Les bases du développement web**

Apprenez à créer vos premières pages web !

Au programme :
• HTML (structure)
• CSS (design)
• JavaScript (interactivité)

📞 Pour vous inscrire ou en savoir plus :
• Formulaire de contact sur le site
• amandine@levelupcreation.com
• +32 497 74 69 06`
    },

    // ── TARIFS GLOBAUX ──────────────────────────
    {
      mots: ["tarifs", "prix", "coût", "combien", "budget", "grille tarifaire"],
      reponse: `**Nos tarifs en un coup d'œil :**

🌐 **SITES WEB**
• Landing Page : dès 250€ HTVA
• Site Vitrine : dès 500€ HTVA
• E-commerce : dès 950€ HTVA
• Sur-mesure : dès 750€ HTVA

🎨 **DESIGN**
• Graphique : dès 280€ HTVA
• Premium : dès 450€ HTVA

✅ Prix clairs, sans frais cachés
✅ Devis gratuit et personnalisé

Contactez-nous pour un devis adapté à votre projet.`
    },

    // ── PAGES SUPPLÉMENTAIRES ───────────────────
    {
      mots: ["page supplémentaire", "ajouter page", "plus de pages", "page en plus"],
      reponse: `**Pages supplémentaires :**

Chaque page ajoutée après la mise en ligne est facturée **100€ HTVA**.

Cela comprend :
• Design de la page
• Intégration responsive
• Optimisation SEO
• Tests et mise en ligne`
    },

    // ── DÉLAIS ──────────────────────────────────
    {
      mots: ["délai", "temps", "durée", "livraison", "combien de temps", "rapide"],
      reponse: `**Délais de livraison :**

⏱️ **Landing Page** : 10-15 jours
⏱️ **Site Vitrine** : 15-30 jours
⏱️ **E-commerce** : 30-50 jours
⏱️ **Site Sur-mesure** : 30+ jours
⏱️ **Design Graphique** : 15-20 jours
⏱️ **Design Premium** : 30+ jours

Ces délais démarrent après validation du projet et réception de tous les éléments (textes, images, contenus).`
    },

    // ── RÉALISATIONS ────────────────────────────
    {
      mots: ["réalisations", "portfolio", "exemples", "projets", "références", "travaux"],
      reponse: `**Nos réalisations :**

Découvrez nos projets dans la section **"Nos Réalisations"** du site :

• Landing pages percutantes
• Sites vitrines élégants
• Boutiques e-commerce performantes
• Identités visuelles complètes
• Motion design & montages vidéo

Chaque projet est unique et reflète l'identité de nos clients.`
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

    // ── LOCALISATION ────────────────────────────
    {
      mots: ["belgique", "bruxelles", "où", "localisation", "distance", "adresse", "lieu"],
      reponse: `**Notre localisation :**

📍 **Bruxelles, Belgique**

Nous travaillons avec :
• Des clients partout en Belgique
• Des clients à l'international (à distance)

**Rendez-vous au bureau :**
Sur rendez-vous uniquement
🕘 09h30 - 12h00 et 13h00 - 16h30

La plupart des projets se déroulent à distance (email, visio, téléphone).`
    },

    // ── RÉSEAUX SOCIAUX ─────────────────────────
    {
      mots: ["instagram", "tiktok", "linkedin", "réseaux sociaux", "suivre", "social media"],
      reponse: `**Suivez-nous sur les réseaux :**

📱 **TikTok** : @levelupcreation
📸 **Instagram** : @level_upcreation
💼 **LinkedIn** : Level Up Creation

Au programme :
• Conseils web & design
• Coulisses du studio
• Actus et projets
• Tips développement

Rejoignez notre communauté ! ✨`
    },

    // ── HTML ────────────────────────────────────
    {
      mots: ["html", "c'est quoi html", "definition html", "signification html"],
      reponse: `**HTML (HyperText Markup Language)**

C'est le **langage de structure** d'un site web.

Avec HTML, on crée :
• Les titres et paragraphes
• Les images
• Les liens
• Les boutons
• Les formulaires

💡 **Analogie :**
HTML = le squelette d'une maison

➡️ Envie d'en apprendre plus ? Découvrez notre formation "Les bases du développement web" !`
    },

    // ── CSS ─────────────────────────────────────
    {
      mots: ["css", "c'est quoi css", "definition css", "signification css"],
      reponse: `**CSS (Cascading Style Sheets)**

C'est le **langage de mise en forme** d'un site web.

Avec CSS, on contrôle :
• Les couleurs 🎨
• Les polices et tailles de texte
• Les espacements et marges
• Le positionnement des éléments
• Les animations

💡 **Analogie :**
HTML = le squelette
CSS = la décoration et le style

➡️ Apprenez-en plus dans notre formation !`
    },

    // ── JAVASCRIPT ──────────────────────────────
    {
      mots: ["javascript", "js", "c'est quoi javascript", "definition javascript"],
      reponse: `**JavaScript (JS)**

C'est le **langage d'interactivité** d'un site web.

Avec JavaScript, on peut :
• Gérer les clics et interactions
• Ouvrir/fermer des menus
• Valider des formulaires
• Créer des animations avancées
• Charger du contenu dynamiquement

💡 **Analogie :**
HTML = le squelette 🏗️
CSS = le style 🎨
JavaScript = les actions ⚙️

➡️ Maîtrisez les 3 avec notre formation !`
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
• Nos tarifs et processus
• Les formations
• Comment nous contacter

Avez-vous une question dans l'un de ces domaines ?`
    }
  ];

  const REPONSE_DEFAULT = `Je n'ai pas compris votre question 😊

Je peux vous renseigner sur :
• Nos **services** (sites web, design, formations)
• Nos **tarifs** et délais
• Notre **processus** de travail
• Comment **nous contacter**

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
    // Supprimer l'indicateur de saisie
    const typing = messages.querySelector(".cw-typing");
    if (typing) typing.remove();

    const msg = document.createElement("div");
    msg.className = `cw-msg ${estBot ? "cw-msg--bot" : "cw-msg--user"}`;

    if (estBot) {
      const name = document.createElement("div");
      name.className = "cw-msg__name";
      name.textContent = "Level Up Creation";
      msg.appendChild(name);
    }

    const bubble = document.createElement("div");
    bubble.className = "cw-msg__bubble";
    
    // Support du formatage (gras, listes, etc.)
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

  // ── ÉVÉNEMENTS ──────────────────────────────
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
      `Bonjour ! 👋

Je suis l'assistante virtuelle de **Level Up Creation**.

Je peux répondre à vos questions sur :
• Nos services web & design
• Nos tarifs
• Notre processus de travail
• Les formations

Comment puis-je vous aider ? ✨`,
      true
    );
    
    if (!isOpen) {
      badge.classList.add("visible");
    }
  }, 1500);
})();