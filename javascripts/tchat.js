
   (() => {
    // ── FAQ ────────────────────────────────────────────
    const FAQ = [
      { mots: ["bonjour","salut","hello","coucou","bonsoir","hey","hi"],
        reponse: `Bonjour ! Je suis l'assistante virtuelle de Level Up Creation.\n\nJe peux répondre sur :\n— Les services et tarifs\n— L'équipe\n— Le développement web (HTML, CSS, JS)\n\nQue puis-je faire pour toi ?` },

      { mots: ["qui est amandine","amandine letellier","fondatrice","createur"],
        reponse: `Amandine Letellier est la fondatrice et développeuse de Level Up Creation.\n\nMaman solo en reconversion, formée à MolenGeek (Bruxelles Formation) et à la Web Discovery Piscine chez 42 Belgium.\n\nElle programme les sites web : structure, intégration, optimisation mobile et mise en ligne.` },

      { mots: ["jonathan","designer","graphiste","motion design"],
        reponse: `Jonathan est le designer graphique & motion designer de l'équipe.\n\nIl s'occupe de :\n— Logo & identité visuelle\n— Montage vidéo\n— Retouche photo\n— Animation 3D\n— Cohérence graphique de ta marque` },

      { mots: ["level up creation","studio","agence","a propos","qui etes vous"],
        reponse: `Level Up Creation conçoit des sites élégants, rapides et pensés pour convertir.\n\nL'équipe :\n— Amandine : développeuse web & fondatrice\n— Jonathan : designer graphique & motion designer\n\nApproche : 100% sur-mesure, prix accessibles, accompagnement humain.` },

      { mots: ["service","prestation","offre","vous faites quoi","que proposez vous"],
        reponse: `Level Up Creation propose :\n\nSITES WEB :\n— Landing Page → à partir de 250€ HTVA (10-15 jours)\n— Site Vitrine ★ → à partir de 500€ HTVA (15-30 jours)\n— Boutique en ligne → à partir de 950€ HTVA (30-50 jours)\n— Site sur mesure → à partir de 750€ HTVA (30 jours+)\n\nDESIGN :\n— Design graphique & motion → à partir de 280€ HTVA\n— Design sur mesure ★ → à partir de 450€ HTVA\n\nABONNEMENTS :\n— Basic → 29,99€/mois · Pro → 59,99€/mois\n\nFORMATION : Les bases du développement web (nouveau !)` },

      { mots: ["landing page","page unique","page de vente","one page"],
        reponse: `Landing Page — à partir de 250€ HTVA\nLivraison : 10 à 15 jours · Mobile + SEO de base\n\n✓ Structure pensée pour maximiser l'acquisition\n✓ Design élégant inspirant confiance\n✓ Formulaire + WhatsApp (ou Messenger)\n✓ Version mobile travaillée au millimètre\n✓ Optimisation technique de base\n✓ Section offre + FAQ + éléments rassurants\n✓ Formation prise en main\n\nAbonnement SUIVI & CROISSANCE disponible en option.` },

      { mots: ["site vitrine","site de presentation","site plusieurs pages"],
        reponse: `Site Vitrine ★ — à partir de 500€ HTVA\nJusqu'à 7 pages · Livraison : 15 à 30 jours\n\n✓ Design sur-mesure aligné à ta marque\n✓ Jusqu'à 6 pages (Accueil, Services, À propos…)\n✓ Pages supplémentaires à 100€/page\n✓ Version mobile travaillée comme une application\n✓ Formulaire + prise de contact fluide\n✓ SEO de base (balises, structure)\n✓ Formation prise en main\n\nL'offre la plus recommandée par Level Up Creation.` },

      { mots: ["boutique","e commerce","ecommerce","vendre en ligne","shop"],
        reponse: `Boutique en ligne — à partir de 950€ HTVA\nLivraison : 30 à 50 jours · Mobile + performance\n\n✓ Catalogue clair, structuré et facile à parcourir\n✓ Design sur-mesure aligné à ta marque\n✓ Paiements courants intégrés\n✓ Optimisation performance (images, cache, UX)\n✓ Pages supplémentaires à 100€/page\n✓ Formation prise en main` },

      { mots: ["site sur mesure","site personnalise","site complet sur mesure"],
        reponse: `Site Web Sur Mesure — à partir de 750€ HTVA\nJusqu'à 7 pages+ · Livraison : 30 jours+\n\n✓ Structure pensée pour maximiser l'acquisition\n✓ Design élégant inspirant confiance\n✓ Formulaire + WhatsApp\n✓ Version mobile au millimètre\n✓ Formation prise en main\n\nRéduction de 15% sur l'abonnement avec cette offre.` },

      { mots: ["design graphique","motion design","logo","identite visuelle","charte graphique","branding","montage video"],
        reponse: `Design Graphique & Motion — à partir de 280€ HTVA\nLivraison : 15 à 20 jours\n\n✓ Logo\n✓ Design sur-mesure aligné à ta marque\n✓ Montages professionnels\n✓ Animation 3D\n✓ Retouche image\n✓ Création visuelle de ta marque` },

      { mots: ["design sur mesure","logo personnalise","design premium"],
        reponse: `Design Sur Mesure ★ — à partir de 450€ HTVA\nLivraison : 30 jours+ · Design premium assuré\n\n✓ Logo 100% personnalisé\n✓ Design élégant inspirant confiance\n✓ Montages professionnels + Animation 3D\n✓ Retouche image\n✓ Création visuelle complète de ta marque\n\nRéduction de 15% sur l'abonnement avec cette offre.` },

      { mots: ["abonnement","suivi","maintenance","entretien","mensuel"],
        reponse: `Abonnements SUIVI & CROISSANCE :\n\nBASIC — 29,99€/mois HTVA\n— Entretien du site tous les 3 mois\n— Accès illimité au compte client\n— Suivi et croissance limités\n\nPRO — 59,99€/mois HTVA\n— Entretien tous les 3 mois\n— Accès illimité au compte client\n— Refonte du site si besoin\n— Suivi et croissance illimités\n\nFacultatifs · Sans engagement long terme\nRéduction 15% pour les clients site/design sur mesure.` },

      { mots: ["formation","apprendre","bases du developpement","s inscrire formation"],
        reponse: `NOUVEAU : Formation "Les bases du développement web" !\n\nIdéale pour apprendre à gérer et modifier ton site en autonomie (HTML, CSS, JavaScript).\n\nAmandine a déjà formé des débutants au HTML/CSS pour l'ASBL UPDATES.\n\nPour réserver :\namandine@levelupcreation.com\n+32 497 74 69 06` },

      { mots: ["tarif","prix","cout","combien","budget","devis","grille tarifaire"],
        reponse: `Tarifs Level Up Creation :\n\nLanding Page       → 250€ HTVA  (10-15 jours)\nSite Vitrine ★     → 500€ HTVA  (15-30 jours)\nBoutique en ligne  → 950€ HTVA  (30-50 jours)\nSite sur mesure    → 750€ HTVA  (30 jours+)\nDesign graphique   → 280€ HTVA  (15-20 jours)\nDesign sur mesure★ → 450€ HTVA  (30 jours+)\n\nPage supplémentaire : 100€\n\nAbonnements :\nBasic → 29,99€/mois · Pro → 59,99€/mois\n\nPrix variables selon complexité. Devis gratuit, sans engagement.` },

      { mots: ["processus","comment ca marche","etapes","comment vous travaillez","deroulement"],
        reponse: `Le processus en 4 étapes :\n\n1. Écoute & analyse\nOn clarifie ton activité, tes objectifs et ce que le site doit accomplir.\n\n2. Maquette personnalisée\nCréée sur base de ton image, pensée pour convertir.\n\n3. Intégration & réglages\nOn intègre, optimise mobile et ajuste chaque détail.\n\n4. Mise en ligne & suivi\nSite en ligne sur ton domaine. On reste disponibles.` },

      { mots: ["pourquoi vous","pourquoi level up","vos avantages","points forts","difference"],
        reponse: `Pourquoi choisir Level Up Creation ?\n\n— Design premium inspiré des meilleures agences\n— Sites 100% sur-mesure (pas de templates)\n— Stratégique : chaque section guide vers l'action\n— Prix clairs, sans frais cachés\n— Livraison rapide une fois validé\n— Accompagnement humain du début à la fin` },

      { mots: ["delai","temps","duree","quand","livraison","combien de temps"],
        reponse: `Délais de livraison :\n\nLanding Page      : 10 à 15 jours\nSite Vitrine      : 15 à 30 jours\nBoutique en ligne : 30 à 50 jours\nSite sur mesure   : 30 jours+\nDesign graphique  : 15 à 20 jours\nDesign sur mesure : 30 jours+\n\nDélais démarrent une fois le projet validé et les éléments reçus.` },

      { mots: ["realisation","portfolio","exemple","projet realise","travaux","reference"],
        reponse: `Réalisations de Level Up Creation :\n\n— Landing Page : exemple complet (accueil, offre, méthode, FAQ, contact)\n— Site Vitrine : présentation, planning, galerie, contact\n— Site e-commerce : catalogue, fiche produit, paiement\n— Montage vidéo pour la marque BOTANEYA\n— To-Do Liste en React.JS\n— Site Art Of Skin (tatouage, piercing, ongles)\n— Template site vitrine pour artiste` },

      { mots: ["contact","joindre","email","mail","telephone","appeler","ecrire","coordonnees"],
        reponse: `Contacter Level Up Creation :\n\nEmail : amandine@levelupcreation.com\nTél : +32 497 74 69 06\n\nRéseaux :\n— TikTok : @levelupcreation\n— Instagram : @level_upcreation\n— LinkedIn : Level Up Creation\n\nAmandine répond sous 24h. Premier échange gratuit.` },

      { mots: ["belgique","bruxelles","localisation","a distance","pays"],
        reponse: `Level Up Creation est basée en Belgique, à Bruxelles.\n\nOn travaille partout en Belgique et à distance pour les clients ailleurs.` },

      { mots: ["newsletter","level up news","abonner newsletter","recevoir infos"],
        reponse: `La Level Up News : reçois les nouveautés et conseils web par email.\n\nInscription : formulaire en bas de la page d'accueil.\nPas de spam. Désinscription en 1 clic.` },

      { mots: ["avis","temoignage","avis client","satisfaction","note","etoile"],
        reponse: `Avis clients (note actuelle : 3/5) :\n\nLisa.L — déc. 2025 — ★★★☆☆\n"Super Pro et humaine"\n\nLucas.S — nov. 2025 — ★★★☆☆\n"Site livré rapidement et très pro"\n\nTu peux laisser ton avis dans la section Avis de la page d'accueil.` },

      { mots: ["page supplementaire","ajouter page","plus de pages","100 euros"],
        reponse: `Pages supplémentaires : 100€/page\n\nS'applique au Site Vitrine, à la Boutique en ligne et au Site sur mesure.\n\nPrécise le nombre de pages dans ta demande de devis.` },

      { mots: ["actualite","nouveaute","news","quoi de neuf","nouveau","annonce"],
        reponse: `Actualité Level Up Creation :\n\n🔴 NOUVEAU : Formation "Les bases du développement web" disponible !\n\nPour réserver ta place :\namandine@levelupcreation.com\nou via le formulaire de contact.` },

      // HTML
      { mots: ["html c est quoi","c est quoi html","definition html","a quoi sert html"],
        reponse: `HTML (HyperText Markup Language) = langage de structure des pages web.\n\nBalises essentielles :\n<h1>–<h6> → titres\n<p>       → paragraphe\n<a href>  → lien\n<img src> → image\n<div>     → bloc\n<form>    → formulaire\n\nHTML structure. CSS met en forme. JS rend interactif.` },

      { mots: ["structure html","squelette html","html de base","template html"],
        reponse: `Structure HTML de base :\n\n<!DOCTYPE html>\n<html lang="fr">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width">\n    <title>Ma page</title>\n    <link rel="stylesheet" href="style.css">\n  </head>\n  <body>\n    <h1>Bonjour</h1>\n    <script src="script.js"></script>\n  </body>\n</html>` },

      { mots: ["balise html","tag html","attribut html","syntaxe html"],
        reponse: `Syntaxe des balises HTML :\n\nAvec fermeture :\n<p>Texte</p>\n<h1>Titre</h1>\n\nAuto-fermantes :\n<img src="photo.jpg" alt="description">\n<input type="text" placeholder="Saisie">\n<br> → saut de ligne\n\nAttributs courants :\nhref, src, alt, class, id, target, rel, required, placeholder` },

      { mots: ["lien html","a href","balise a","hyperlien"],
        reponse: `Liens HTML :\n\nExterne :\n<a href="https://levelupcreation.com" target="_blank" rel="noopener">Visiter</a>\n\nInterne :\n<a href="./contact.html">Contact</a>\n\nVers section :\n<a href="#services">Services</a>\n\nEmail :\n<a href="mailto:amandine@levelupcreation.com">Email</a>\n\nTél :\n<a href="tel:+32497746906">Appeler</a>` },

      { mots: ["image html","balise img","afficher image","photo html"],
        reponse: `Afficher une image :\n\n<img src="photo.jpg" alt="Description" width="600">\n\nsrc → chemin (obligatoire)\nalt → texte alternatif (SEO + accessibilité, obligatoire !)\nwidth / height → dimensions\n\nResponsive CSS :\nimg { max-width: 100%; height: auto; }` },

      { mots: ["formulaire html","form html","input html","champ html"],
        reponse: `Formulaire HTML :\n\n<form action="envoyer.php" method="POST">\n  <label for="nom">Nom :</label>\n  <input type="text" id="nom" name="nom" required>\n\n  <input type="email" id="email" name="email" required>\n\n  <textarea name="message" rows="5"></textarea>\n\n  <button type="submit">Envoyer</button>\n</form>\n\nTypes : text, email, password, number, tel, date, checkbox, radio, file` },

      { mots: ["liste html","ul ol li","liste a puces"],
        reponse: `Listes HTML :\n\nPuces :\n<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>\n\nNumérotée :\n<ol>\n  <li>Étape 1</li>\n  <li>Étape 2</li>\n</ol>` },

      { mots: ["semantique html","html semantique","header footer main nav section article"],
        reponse: `HTML sémantique :\n\n<header>  → en-tête\n<nav>     → menu\n<main>    → contenu principal\n<section> → section thématique\n<article> → contenu autonome\n<aside>   → contenu secondaire\n<footer>  → pied de page\n\nImportant pour le SEO et l'accessibilité.` },

      // CSS
      { mots: ["css c est quoi","c est quoi css","definition css","a quoi sert css"],
        reponse: `CSS (Cascading Style Sheets) = langage de mise en forme des pages web.\n\nSans CSS : texte brut.\nAvec CSS : couleurs, polices, espacements, animations...\n\nIntégration :\n<link rel="stylesheet" href="style.css">` },

      { mots: ["selecteur css","syntaxe css","regle css","comment cibler css"],
        reponse: `Syntaxe CSS :\n\nsélecteur { propriété: valeur; }\n\np { color: blue; }          → tous les <p>\n.carte { background: red; } → classe\n#titre { font-size: 2rem; } → id\na:hover { }                → au survol\ninput:focus { }            → champ actif` },

      { mots: ["couleur css","color css","background css","rgba hex hsl"],
        reponse: `Couleurs CSS :\n\ncolor: red;\ncolor: #df437c;\ncolor: rgba(223, 67, 124, 0.5);\ncolor: hsl(337, 71%, 57%);\nbackground: linear-gradient(135deg, #df437c, #6366f1);\n\nPropriétés :\ncolor → texte\nbackground-color → fond\nborder-color → bordure\nopacity → transparence` },

      { mots: ["police css","font css","typographie","font family","google fonts"],
        reponse: `Typographie CSS :\n\nfont-family: 'Poppins', sans-serif;\nfont-size: 1rem;\nfont-weight: 700;\nline-height: 1.6;\ntext-align: center;\ntext-transform: uppercase;\n\nGoogle Fonts :\n<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">` },

      { mots: ["box model","margin padding","border css","marge","espacement"],
        reponse: `Box Model CSS :\n\nMARGIN  → espace extérieur\nBORDER  → bordure\nPADDING → espace intérieur\nCONTENT → le contenu\n\nExemple :\n.carte {\n  padding: 20px;\n  border: 2px solid #ddd;\n  border-radius: 12px;\n  margin: 16px auto;\n}\n\nAstuce :\n* { box-sizing: border-box; }` },

      { mots: ["flexbox","flex css","display flex","justify content","align items"],
        reponse: `Flexbox :\n\n.container {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n\nCentrer parfaitement :\ndisplay: flex;\njustify-content: center;\nalign-items: center;` },

      { mots: ["grid css","display grid","css grid","grille css"],
        reponse: `CSS Grid :\n\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n\nResponsive auto :\ngrid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n\nGrid = 2D · Flex = 1D` },

      { mots: ["responsive css","media query","mobile css","breakpoint","mobile first"],
        reponse: `Responsive CSS :\n\n/* Mobile first */\n.container { padding: 16px; }\n\n/* Tablette */\n@media (min-width: 768px) {\n  .container { padding: 32px; }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .container { max-width: 1120px; margin: 0 auto; }\n}` },

      { mots: ["variable css","css variable","custom property","root css","var css"],
        reponse: `Variables CSS :\n\n:root {\n  --accent: #df437c;\n  --radius: 12px;\n  --shadow: 0 20px 60px rgba(0,0,0,0.55);\n}\n\n.bouton {\n  background: var(--accent);\n  border-radius: var(--radius);\n}` },

      { mots: ["animation css","transition css","hover css","keyframe css"],
        reponse: `Animations CSS :\n\nTransition :\n.bouton {\n  transition: transform 0.2s ease;\n}\n.bouton:hover { transform: scale(1.05); }\n\nKeyframes :\n@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n.el { animation: fadeIn 0.5s ease forwards; }` },

      { mots: ["position css","absolute","relative","fixed","sticky","z index"],
        reponse: `Positionnement CSS :\n\nstatic  → par défaut\nrelative → décalé, flux conservé\nabsolute → sorti du flux\nfixed   → fixe dans la fenêtre\nsticky  → se fixe au scroll\n\nMenu fixe :\n.nav { position: fixed; top: 0; left: 0; width: 100%; z-index: 100; }` },

      // JS
      { mots: ["javascript c est quoi","js c est quoi","definition javascript","a quoi sert js"],
        reponse: `JavaScript = rend les pages web interactives.\n\nHTML → structure\nCSS  → style\nJS   → comportement\n\nCe qu'il peut faire :\n— Réagir aux clics\n— Modifier le HTML/CSS\n— Valider des formulaires\n— Appeler des APIs\n— Stocker des données\n\n<script src="script.js"></script>` },

      { mots: ["variable javascript","var let const","declarer variable"],
        reponse: `Variables JS :\n\nconst nom = "Amandine"  → fixe\nlet age = 25            → modifiable\n\n// var est obsolète, évite-le\n\nconst PI = 3.14\nlet compteur = 0\ncompteur++     → 1\ncompteur += 5  → 6\n\nRègle : const par défaut, let si ça change.` },

      { mots: ["fonction javascript","function js","creer fonction","arrow function"],
        reponse: `Fonctions JS :\n\nClassique :\nfunction saluer(prenom) {\n  return "Bonjour " + prenom\n}\n\nArrow function :\nconst saluer = (prenom) => "Bonjour " + prenom\nconst double = n => n * 2\n\nsaluer("Amandine") → "Bonjour Amandine"\ndouble(5)          → 10` },

      { mots: ["condition javascript","if else js","ternaire js","switch js"],
        reponse: `Conditions JS :\n\nif (age >= 18) {\n  console.log("Majeur")\n} else {\n  console.log("Mineur")\n}\n\nTernaire :\nconst msg = age >= 18 ? "Majeur" : "Mineur"\n\nNullish :\nconst nom = user.nom ?? "Anonyme"` },

      { mots: ["boucle javascript","for js","foreach js","map filter reduce"],
        reponse: `Boucles JS :\n\nfor (let i = 0; i < 5; i++) { console.log(i) }\n\nforEach :\nfruits.forEach(f => console.log(f))\n\nmap :\nconst maj = fruits.map(f => f.toUpperCase())\n\nfilter :\nconst grands = [5,12,3,18].filter(n => n > 10) → [12,18]\n\nreduce :\n[10,20,30].reduce((acc,n) => acc+n, 0) → 60` },

      { mots: ["dom javascript","manipuler dom","queryselector","getelementbyid"],
        reponse: `DOM avec JS :\n\ndocument.getElementById("titre")\ndocument.querySelector(".bouton")\ndocument.querySelectorAll("li")\n\nel.textContent = "Nouveau texte"\nel.style.color = "#df437c"\nel.classList.add("actif")\nel.classList.toggle("actif")\n\nCréer :\nconst div = document.createElement("div")\ndocument.body.appendChild(div)` },

      { mots: ["event javascript","addeventlistener","clic js","evenement js"],
        reponse: `Événements JS :\n\nbtn.addEventListener("click", (e) => {\n  console.log("Cliqué !")\n})\n\nÉvénements courants :\nclick · input · submit · keydown · scroll · resize · DOMContentLoaded\n\nEmpêcher le défaut :\nform.addEventListener("submit", (e) => {\n  e.preventDefault()\n})` },

      { mots: ["async await","promise js","fetch js","asynchrone js","appel api"],
        reponse: `Async/await JS :\n\nasync function getData() {\n  try {\n    const res  = await fetch("https://api.example.com/data")\n    const data = await res.json()\n    return data\n  } catch (err) {\n    console.error(err)\n  }\n}\n\nPOST :\nawait fetch("/api", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(data)\n})` },

      { mots: ["localstorage","sessionstorage","stocker donnees","sauvegarder js"],
        reponse: `localStorage JS :\n\nlocalStorage.setItem("nom", "Amandine")\nlocalStorage.setItem("user", JSON.stringify({ age: 25 }))\n\nconst nom  = localStorage.getItem("nom")\nconst user = JSON.parse(localStorage.getItem("user"))\n\nlocalStorage.removeItem("nom")\nlocalStorage.clear()\n\nsessionStorage → s'efface à la fermeture de l'onglet.` },

      { mots: ["console","console log","deboguer","debug js","erreur js"],
        reponse: `Déboguer JS :\n\nconsole.log("Message")\nconsole.warn("Attention")\nconsole.error("Erreur !")\nconsole.table([{ nom: "A" }])\n\nOuvrir : F12 → onglet Console\n\ndebugger → met en pause l'exécution\n\nErreurs courantes :\n"is not defined" → variable non déclarée\n"is not a function" → mauvais appel\n"Cannot read properties of undefined" → valeur undefined` },

      // REMERCIEMENTS / FIN
      { mots: ["merci","super","parfait","genial","top","cool","nickel","utile"],
        reponse: "Avec plaisir ! N'hésite pas si tu as d'autres questions 😊" },

      { mots: ["au revoir","bye","bonne journee","bonne soiree","a bientot"],
        reponse: "À bientôt ! Bonne continuation 👋" },

      { mots: ["meteo","sport","foot","recette","cuisine","film","musique"],
        reponse: "Je suis spécialisée dans Level Up Creation et le développement web. Pour le reste, je ne peux pas aider !\n\nTu voulais en savoir plus sur nos services ou le HTML/CSS/JS ?" }
    ];

    const REPONSE_DEFAULT = `Je n'ai pas bien compris.\n\nEssaie par exemple :\n— "Combien coûte un site vitrine ?"\n— "C'est quoi flexbox ?"\n— "Quels sont vos délais ?"\n\nOu contacte Amandine :\namandine@levelupcreation.com`;

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
      ajouterMessage("Bonjour ! Je suis l'assistante de Level Up Creation. Comment puis-je t'aider ?", true);
      if (!isOpen) badge.classList.add("visible");
    }, 1200);
  })();