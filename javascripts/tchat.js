
   (() => {
 // ================================================
// CHATBOT — BASE DE CONNAISSANCE LEVEL UP CREATION
// ================================================
const FAQ = [

  // ── SALUTATIONS ──────────────────────────────
  {
    mots: ["bonjour", "salut", "hello", "coucou", "bonsoir", "hey", "hi"],
    reponse: `Salut toi 👋
Je suis l’assistante de Level Up Creation.

Tu as une question sur nos services, nos tarifs, l’équipe ou la création de site web ?
Pose-moi ta question et je te répondrai au mieux 😊

En quoi puis-je t’aider ? ✨`
  },
// ── comment tu vas ──────────────────────────────
  {
    mots: ["Comment tu vas", "Est-ce que tu vas bien ?", "Quoi de neuf ?", "Tout va bien",],
    reponse: `Salut toi 👋
Je vais bien, et toi ? 😊
En quoi puis-je t’aider ?`
  },
// ── Réponse positive ──────────────────────────────
  {
    mots: ["Je vais bien", "Je suis heureuse", " tout va bien", "je suis contente","contente", "ravis","heureux","ça va", "ça va bien","ça va super bien","ça roule", "je vais super bien", "je vais très bien", "je vais très très bien", "je vais très très très bien"],
    reponse: `Super, je suis ravie de l’entendre ! En quoi puis-je t’aider ? 😊`
  },

  // ── Réponse Négatif ──────────────────────────────
  {
    mots: ["Je vais mal", "Je suis triste", "je suis déprimée", "je suis déçu", "je suis frustré", "je suis en colère", "je suis stressé", "je suis anxieux", "je suis pas bien", "je vais pas bien", "ça va pas", "ça va mal", "pas terrible", "bof", "peu mieux faire", "j’ai pas la forme", "j’ai pas le moral", "c’est dur en ce moment", "c’est compliqué en ce moment", "c’est pas facile en ce moment", "c’est pas la grande forme en ce moment", "c’est pas la joie en ce moment", "c’est pas la fête en ce moment", "c’est pas la super forme en ce moment", "c’est pas la grande joie en ce moment", "c’est pas la grande fête en ce moment"],
    reponse: `Je suis désolée de l’apprendre. En quoi puis-je t’aider ? 😊`
  },
  // ── QUI EST AMANDINE ─────────────────────────
  {
    mots: ["qui est amandine", "amandine letellier", "fondatrice", "createur", "qui etes vous", "qui es tu,"],
    reponse: `Amandine est la créatrice de Level Up Creation et Développeuse web passionnée.`
  },

  // ── QUI EST JONATHAN ─────────────────────────
  {
    mots: ["jonathan", "designer", "graphiste", "motion design", "qui fait le design", "equipe design"],
    reponse: `Jonathan est le designer graphique et motion designer de Level Up Creation et motion designer passionné.`
  },

  // ── LE STUDIO / À PROPOS ─────────────────────
  {
    mots: ["level up creation", "studio", "agence", "a propos", "qui etes vous", "votre agence", "c est qui"],
    reponse: `Level Up Creation crée des sites web beaux, rapides et efficaces et On fait du 100% sur-mesure.`
  },

  // ── POURQUOI LEVEL UP ─────────────────────────
  {
    mots: ["pourquoi vous", "pourquoi level up", "vos avantages", "points forts", "difference", "ce qui vous distingue"],
    reponse: ` 1.Design premium et cohérent
Un site moderne, élégant et professionnel.

2.100% sur-mesure
Chaque section est pensée pour convertir.

3.Aligné à ta marque
Un site unique, prêt à l’emploi.

4.Accompagnement complet
On reste disponibles pour t’aider à évoluer.

5.Prix clairs
Pas de frais cachés.

6.Livraison rapide
Site en ligne en quelques jours après validation.`
  },

  // ── PROCESSUS DE TRAVAIL ─────────────────────
  {
    mots: ["processus", "comment ca marche", "etapes", "comment vous travaillez", "deroulement", "comment fonctionne"],
    reponse: `Le processus de travail chez Level Up Creation en 4 étapes :

1. Écoute & analyse

2. Maquette personnalisée

3. Intégration & réglages

4. Mise en ligne & suivi

Tout commence par un échange gratuit, sans engagement.`
  },

  // ── SERVICES (VUE GLOBALE) ────────────────────
  {
    mots: ["service", "prestation", "offre", "vous faites quoi", "que proposez vous", "liste services"],
    reponse: `Level Up Creation propose :

- SITES WEB 

- DESIGN ou motion design 

- FORMATIONS `
  },

  // ── LANDING PAGE ─────────────────────────────
  {
    mots: ["landing page", "page unique", "page de vente", "one page", "page d accueil,page vitrine simple, page, site web sur une page, page de présenation"],
    reponse: `Landing Page chez Level Up Creation :

À partir de 250€ HTVA
Livraison : 10 à 15 jours
Mobile + SEO de base`
  },

  // ── SITE VITRINE ─────────────────────────────
  {
    mots: ["site vitrine", "site de presentation", "site plusieurs pages", "site classique, je désire un site pour mon projet, site web pour mon entreprise,site web pour mon activité."],
    reponse: `Voici le prix d'un site vitrine :
À partir de 500€ HTVA
Jusqu'à 7 pages · Livraison : 15 à 30 jours
Mobile + SEO de base
Idéal pour présenter ton activité et générer des contacts qualifiés.`
  },

  // ── BOUTIQUE EN LIGNE ─────────────────────────
  {
    mots: ["boutique", "e commerce", "ecommerce", "vendre en ligne", "shop", "magasin en ligne", "boutique en ligne"],
    reponse: `Voici le prix d'un site boutique ou e-shop : 

À partir de 950€ HTVA
Livraison : 30 à 50 jours (selon nombre de produits)
Mobile + performance
`
  },

  // ── SITE SUR MESURE ──────────────────────────
  {
    mots: ["site sur mesure", "site personnalise", "site complet sur mesure", "site web sur mesure"],
    reponse: `Voici le prix d'un site sur mesure :
À partir de 750€ HTVA
Jusqu'à 7 pages et plus · Livraison : 30 jours et plus
Mobile + SEO de base`
  },

  // ── DESIGN GRAPHIQUE ─────────────────────────
  {
    mots: ["design graphique", "motion design", "logo", "identite visuelle", "charte graphique", "branding", "montage video", "retouche photo", "animation 3d", "visuel"],
    reponse: `Voici les prix des services de notre designer & Motion Design :

À partir de 280€ HTVA
Livraison : 15 à 20 jours
Pro et adapté à tous supports`
  },

  // ── DESIGN SUR MESURE ────────────────────────
  {
    mots: ["design sur mesure", "logo personnalise", "design premium", "design complet"],
    reponse: `Voici les prix des services de notre designer & Motion Design d'un desgin sur mesure : 
À partir de 450€ HTVA
Livraison : 30 jours et plus
Pro et adapté à tous supports · Design premium assuré`
  },

  // ── FORMATION ────────────────────────────────
  {
    mots: ["formation", "apprendre", "cours", "bases du developpement", "s inscrire formation", "formation web", "nouveau"],
    reponse: `Chez Level Up Creation vous pouvez aussi apprendre "Les bases du développement web" !

Pour réserver ou avoir plus d'infos :
— Via le formulaire de contact sur le site (section Contact)
— Par email : amandine@levelupcreation.com
— Par téléphone : +32 497 74 69 06`
  },

  // ── TARIFS (VUE GLOBALE) ─────────────────────
  {
    mots: ["tarif site web", "prix site web", "cout site web", "combien pour un site web", "budget pour un site web", "grille tarifaire pour un site web", "c est combien pour un site web", "ca coute combien un site"],
    reponse: `Chez nous les prix sont claire et sans suprise.  :

SITES WEB :
Nous pouvont démarrer à partir de 250€ HTVA selon ton projet n'hésite pas à nous contacter aux +32 497 74 69 06.`
  },

  // ── PAGES SUPPLÉMENTAIRES ────────────────────
  {
    mots: ["page supplementaire", "ajouter page", "plus de pages", "combien la page", "pages en plus"],
    reponse: `Chaque page supplémentaire que tu veux après la mise en ligne du site est facturée 100€ HTVA`
  },

  // ── DÉLAIS ───────────────────────────────────
  {
    mots: ["delai", "temps", "duree", "quand", "livraison", "combien de temps", "rapidite","sa prend combien de temps", "c'est rapide ou pas ?", "rapide","lent","long","court","delais de livraison"],
    reponse: `Les délais de livraison chez Level Up Creation :

Landing Page           : 10 à 15 jours
Site Vitrine           : 15 à 30 jours
Boutique en ligne      : 30 à 50 jours (selon nombre de produits)
Site sur mesure        : 30 jours et plus
Design graphique       : 15 à 20 jours
Design sur mesure      : 30 jours et plus

Ces délais démarrent une fois le projet validé et les éléments reçus (textes, photos, informations).`
  },

  // ── RÉALISATIONS / PORTFOLIO ─────────────────
  {
    mots: ["realisation", "portfolio", "exemple", "projet realise", "travaux", "reference", "deja fait"],
    reponse: `Nos réalisations :

— Landing Page 
— Site Vitrine 
— Site e-commerce 
— Design de votre marque
- Montage vidéo
Tu peux voir tous ces exemples dans la section Nos réalisations du site.`
  },

  // ── CONTACT ──────────────────────────────────
  {
    mots: ["contact", "joindre", "email", "mail", "telephone", "appeler", "ecrire", "comment vous contacter", "coordonnees"],
    reponse: `Pour nous contacter tu peux :
envoyer un mail à : amandine@levelupcreation.com ou envoyer un what sapp au +32 497 74 69 06.
Tu peux aussi le faire via le formulaire de contact du site. 

Amandine répond généralement sous 24h en semaine.pas de panique si tu n'as pas de réponse immédiate, on traite les demande dans l'ordre d'arrivée et on fait au mieux pour répondre rapidment à tout le monde !`
  },


  // ── LOCALISATION ─────────────────────────────
  {
    mots: ["belgique", "bruxelles", "ou etes vous", "localisation", "a distance", "deplacement", "pays","europe", "où vous trouvez vous?","lieu,adresse"],
    reponse: `Level Up Creation est basée en Belgique, à Bruxelles.

On travaille avec des clients :
— Partout en Belgique
— À distance pour les clients ailleurs.

La plupart des projets se font à distance, avec des échanges réguliers par email, téléphone ou visio, Vous pouvez Toujour venir à nos bureau Sur Rendez-vous De 09h30 à 12h00  et de 13h00 à 16h30.`
  },


  // ── RÉSEAUX SOCIAUX ──────────────────────────
  {
    mots: ["instagram", "tiktok", "linkedin", "reseau sociaux", "suivre", "ou vous suivre", "reseaux","social media", "ou vous trouver sur les reseaux sociaux", "compte instagram", "compte tiktok", "compte linkedin", "vos reseaux sociaux"],
    reponse: `Level Up Creation est active sur les réseaux :

TikTok : @levelupcreation
Instagram : @level_upcreation
LinkedIn : Level Up Creation

Suis-nous pour des conseils web, les coulisses du studio et les dernières actus de Level Up Creation.`
  },

  // ════════════════════════════════════════════
  // COURS HTML
  // ════════════════════════════════════════════

  {
    mots: ["html c est quoi", "c est quoi html", "definition html", "a quoi sert html", "kesako html","html signification","html", "c est quoi le html", "a quoi sert le html", "definition du html", "html kesako"],
    reponse: `HTML, ça veut dire HyperText Markup Language.

C’est le langage de base d’un site web.
Il sert à structurer le contenu d’une page.

Avec HTML, on peut :

Ajouter des titres

Écrire du texte

Mettre des images

Créer des boutons

Ajouter des liens

👉 En résumé :
HTML crée la structure du site (le squelette). Si tu veux apprendre plus viens à notre formation "Les bases du développement web" !`
  },

  // ════════════════════════════════════════════
  // COURS CSS
  // ════════════════════════════════════════════

  {
    mots: ["css c est quoi", "c est quoi css", "definition css", "a quoi sert css", "kesako css","css signification","css", "c est quoi le css", "a quoi sert le css", "definition du css", "css kesako","c est quoi le css", "a quoi sert le css", "definition du css", "css kesako","css"],
    reponse: `CSS, ça veut dire Cascading Style Sheets.

C’est le langage qui sert à mettre en forme un site web.

Avec CSS, on peut :

Changer les couleurs 🎨

Modifier la taille du texte

Ajouter des marges et des espacements

Mettre des éléments au centre

Créer des animations

👉 En résumé :
HTML crée la structure (le squelette)
CSS ajoute le style (les vêtements et le design)

Si tu veux apprendre plus viens à notre formation "Les bases du développement web" !`
  },


  // ════════════════════════════════════════════
  // COURS JAVASCRIPT
  // ════════════════════════════════════════════

  {
    mots: ["javascript c est quoi", "js c est quoi", "definition javascript", "a quoi sert javascript", "a quoi sert js","kesako javascript","javascript signification","js signification","javascript", "c est quoi le javascript", "a quoi sert le javascript", "definition du javascript", "javascript kesako","c est quoi le js", "a quoi sert le js", "definition du js", "js kesako","c est quoi le js", "a quoi sert le js", "definition du js", "js kesako","javascripts"],
    reponse: `JavaScript, c’est le langage qui rend un site web interactif.

Il sert à ajouter du mouvement et des actions.

Avec JavaScript, on peut :

Faire fonctionner un bouton

Ouvrir un menu

Afficher une popup

Vérifier un formulaire

Mettre à jour du contenu sans recharger la page

👉 En résumé :

HTML = la structure 🏗️

CSS = le style 🎨

JavaScript = les actions et l’interaction ⚙️

Si tu veux apprendre plus viens à notre formation "Les bases du développement web" !`
  },

  // ── REMERCIEMENTS ────────────────────────────
  {
    mots: ["merci", "super", "parfait", "genial", "top", "cool", "nickel", "utile", "tres bien","c est parfait", "c est super", "c est genial", "c est top", "c est cool", "c est nickel", "c est utile", "c est tres bien"],
    reponse: "Avec plaisir ! N'hésite pas si tu as d'autres questions sur Level Up Creation ou sur le développement web !"
  },

  {
    mots: ["au revoir", "bye", "bonne journee", "bonne soiree", "a bientot", "ciao","a plus", "a la prochaine", "bonne continuation", "bonne fin de journée", "bonne fin de soiree"],
    reponse: "À bientôt ! Bonne continuation 👋"
  },

  // ── HORS SUJET ────────────────────────────────
  {
    mots: ["meteo", "sport", "foot", "recette", "cuisine", "film", "musique", "jeu video","voyage", "vacances", "sante", "medecine", "psychologie", "philosophie", "politique", "economie", "finance", "crypto", "astrologie", "horoscope", "animaux", "nature", "environnement", "espace", "astronomie", "histoire", "geographie", "culture generale"],
    reponse: "Désolée, je ne suis pas en mesure de répondre à cette question 😊 Je suis l’assistante de Level Up Creation et je peux uniquement t’aider concernant nos services, nos tarifs ou le développement web (HTML, CSS, JavaScript).Si tu as une question dans ce domaine, je serai ravie de t’aider ✨"
  }
];

const REPONSE_DEFAULT = `Désolée, je ne suis pas en mesure de répondre à cette question 😊.

Je suis l’assistante de Level Up Creation et je peux uniquement t’aider Si tu as une question dans ce domaine, je serai ravie de t’aider ✨
Ou contacte directement Amandine :
amandine@levelupcreation.com · +32 497 74 69 06`;

function reponseBot(message) {
  const msg = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const item of FAQ) {
    if (item.mots.some(mot => msg.includes(mot))) return item.reponse;
  }
  return REPONSE_DEFAULT;
}

    // ── DOM ────────────────────────────────────────────
    const toggle   = document.getElementById("chatToggle");
    const widget   = document.getElementById("chatWidget");
    const closeBtn = document.getElementById("chatClose");
    const messages = document.getElementById("cwMessages");
    const input    = document.getElementById("cwInput");
    const sendBtn  = document.getElementById("cwSend");
    const badge    = document.getElementById("chatBadge");

    let isOpen = false;

    function heure() {
      return new Date().toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });
    }

    function ajouterMessage(texte, estBot) {
      const typing = messages.querySelector(".cw-typing");
      if (typing) typing.remove();

      const msg = document.createElement("div");
      msg.className = "cw-msg " + (estBot ? "cw-msg--bot" : "cw-msg--user");

      if (estBot) {
        const name = document.createElement("div");
        name.className = "cw-msg__name";
        name.textContent = "Level Up Creation";
        msg.appendChild(name);
      }

      const bubble = document.createElement("div");
      bubble.className = "cw-msg__bubble";
      bubble.textContent = texte;
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
      await new Promise(r => setTimeout(r, 900));
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

    toggle.addEventListener("click", () => isOpen ? fermerChat() : ouvrirChat());
    closeBtn.addEventListener("click", fermerChat);
    sendBtn.addEventListener("click", envoyerMessage);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); envoyerMessage(); }
    });

    // Message de bienvenue au chargement
    setTimeout(() => {
      ajouterMessage("Hey toi 👋 Je suis l’assistante de Level Up Creation. Tu cherches un site web, des infos sur nos services ou tu as une question en développement web ? Dis-moi tout, je suis là pour t’aider 💗", true);
      if (!isOpen) badge.classList.add("visible");
    }, 1200);
  })();