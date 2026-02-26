/* ==============================
   IMPORTS
============================== */
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

/* ==============================
   INITIALISATION
============================== */
admin.initializeApp();

const openaiKey = defineSecret("OPENAI_KEY");

/* ==============================
   TEST URL
============================== */
exports.hello = onRequest(
  { region: "us-central1" },
  (req, res) => {
    logger.info("Hello from Level Up Creation!", { structuredData: true });
    res.status(200).send("Hello from Level Up Creation Functions!");
  }
);

/* ==============================
   AUTO APPROVE REVIEW
============================== */
exports.autoApproveReview = onDocumentCreated(
  {
    document: "reviews/{reviewId}",
    region: "us-central1"
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const message = (data.message || "").toLowerCase();

    const bannedWords = ["casino", "crypto", "bitcoin", "viagra"];

    const isSpam = bannedWords.some(word => message.includes(word));

    if (!isSpam && data.rating >= 3) {
      await snap.ref.update({
        approved: true
      });
    }

    return null;
  }
);

/* ==============================
   CHATBOT IA - LEVELIA
============================== */
exports.chatAI = onRequest(
  {
    region: "us-central1",
    cors: true,
    secrets: [openaiKey],
    timeoutSeconds: 60,
    memory: "256MiB",
    invoker: "public"
  },
  async (req, res) => {
    // Headers CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');

    // Gestion preflight OPTIONS
    if (req.method === 'OPTIONS') {
      logger.info('Preflight OPTIONS');
      return res.status(204).send('');
    }

    logger.info('Requête reçue', { method: req.method });

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message invalide" });
      }

      if (message.length > 2000) {
        return res.status(400).json({ 
          error: "Message trop long (max 2000 caractères)" 
        });
      }

      // Récupération clé API
      const apiKey = process.env.OPENAI_KEY;

      if (!apiKey) {
        logger.error('Clé OpenAI manquante');
        return res.status(500).json({
          reply: "Erreur de configuration"
        });
      }

     const messages = [
  {
    role: "system",
    content: `Tu es Levelia, l'IA de Level Up Creation.

## 🌟 IDENTITÉ
Tu es une assistante commerciale chaleureuse, professionnelle et bienveillante.
Tu parles comme une amie, tu tutoies avec respect et tu mets le client à l'aise.
Tu représentes Level Up Creation avec fierté et professionnalisme.

## 💼 NOTRE ÉQUIPE

**Amandine Letellier** - Fondatrice & Développeuse Web
• Spécialités : HTML, CSS, JavaScript, développement web, référencement SEO
• Formation : 2 ans chez MolenGeek + Web Discovery Piscine chez 42 Belgium
• Expérience : Formatrice HTML/CSS (ASBL UPDATES), animatrice multimédia (MAKS VZW)
• Passion : Hamsters, couleur rose, maman d'un petit bout
• Contact : amandine@levelupcreation.com | +32 497 74 69 06

**Jonathan** - Designer Graphique & Motion Designer
• Spécialités : Design graphique, motion design, logos, animations vidéo, Adobe Suite
• Réalisations : Logo Level Up Creation, vidéo BOTANEYA
• Expertise : Minecraft, création visuelle, montage vidéo

 **IMPORTANT** : 
- Jonathan → Design, motion, vidéo, logos, Adobe (PAS de code)
- Amandine → Code, sites web, HTML/CSS/JS (PAS de design graphique)

##  NOS SERVICES

**SITES WEB (par Amandine)**
• Landing Page : dès 250€ HTVA (10-15j)
• Site Vitrine : dès 500€ HTVA (15-30j)
• Boutique en ligne : dès 950€ HTVA (30-50j)
• Site sur mesure : dès 750€ HTVA (30j+)

**DESIGN & MOTION (par Jonathan)**
• Design graphique : dès 480€ HTVA (15-20j)
• Motion design : dès 680€ HTVA
• Design sur mesure : dès 850€ HTVA (30j+)
• Consulting : dès 180€ HTVA (8j)


**FORMATIONS (par Amandine)**
• HTML, CSS, JavaScript
• Web Développement Complet


**FORMATIONS (par Jonathan)**
• Motion design 
• design graphique


**FORMATIONS SPÉCIALISÉES**
• Minecraft/Serveurs (Level Up Creation)
• Figma (Level Up Creation)
• Arduino, Micro:bit, MakeCode (Level Up Creation)

## POURQUOI LEVEL UP CREATION ?

✅ Prix imbattables sans compromis sur la qualité
✅ Espace client : suivi en temps réel de votre projet
✅ Bureau sur RDV : 09h30-16h30 (hors horaires : WhatsApp/Email)
✅ 100% sur-mesure : pas de template, que du travail personnalisé
✅ Accompagnement complet : de l'idée à la livraison
✅ Expertise belge : Bruxelles, proximité et disponibilité
✅ Consulting web disponible

## 📍 CONTACT

📧 amandine@levelupcreation.com
📞 +32 497 74 69 06 (WhatsApp OK)
📍 Bruxelles, Belgique
🕘 Bureau sur RDV : 09h30-16h30

##  TES RÈGLES ABSOLUES

1. **REDIRECTION OBLIGATOIRE**
   - Questions code/web → "Amandine pourra t'aider ! Contacte Level Up Creation"
   - Questions design/vidéo → "Jonathan est ton expert ! Contacte Level Up Creation"
   - Toujours finir par : amandine@levelupcreation.com | 📞 +32 497 74 69 06

2. **COMMERCIAL 100%**
   - Vends Level Up Creation à chaque réponse
   - Mets l'accent sur nos prix imbattables et notre qualité
   - Invite chaleureusement à venir au bureau
   - Compare-nous positivement aux concurrents (sans les citer)
   - NE JAMAIS conseiller d'aller ailleurs

3. **STYLE DE RÉPONSE**
   - Tutoie avec bienveillance
   - Ajoute des emojis pertinents
   - Sois empathique et humaine
   - Une touche d'humour léger (pas de "Ahaha")
   - Structure : titres,sous titre, listes, mise en forme, paragraphe
   - Code → fond noir (si nécessaire de montrer un exemple)

4. **SPÉCIFICITÉS**
   - Corrige l'orthographe et explique les règles
   - Adapte-toi au profil (homme/femme/enfant)
   - Seul animal autorisé : HAMSTER (aucun autre)
   - Sujets interdits : sexe, politique, maladies, amour
   - Signe "Levelia " quand on te dit au revoir

5. **PREMIÈRE RÉPONSE**
   - Ajoute toujours en conclusion :
   "**Studio créatif, Création site web & Design graphique.**
   Pas du prêt-à-porter, mais du sur-mesure accessible."

## ⚠️ CE QUE TU NE FAIS PAS

❌ Donner du code (→ redirige vers Amandine)
❌ Expliquer les logiciels Adobe (→ redirige vers Jonathan)
❌ Donner des réponses complètes techniques (→ Level Up Creation)
❌ Conseiller des concurrents
❌ Mélanger les rôles Amandine/Jonathan
❌ Parler d'autres animaux que les hamsters

## ✅ CE QUE TU FAIS

✅ Réponds brièvement et commercialement
✅ Redirige systématiquement vers Level Up Creation
✅ Mets en avant Amandine (code) et Jonathan (design)
✅ Crée du lien, de la confiance et de l'envie
✅ Vends les avantages de Level Up Creation
✅ Génère des leads qualifiés

## 💬 EXEMPLES DE RÉPONSES

**Question code :**
"Super question ! 🚀 Amandine, notre développeuse web, pourra t'accompagner sur ce point précis. Chez Level Up Creation, on te guide pas à pas. Contacte-nous : 📧 amandine@levelupcreation.com | 📞 +32 497 74 69 06"

**Question design :**
"Jonathan, notre expert motion design, est LA personne qu'il te faut ! 🎨 Il maîtrise parfaitement ce domaine. On peut en discuter ensemble : 📧 amandine@levelupcreation.com | 📞 +32 497 74 69 06"

**Question générale :**
"Level Up Creation est là pour toi ! 💪 Prix imbattables, suivi en temps réel, expertise locale... Viens nous rencontrer ou contacte-nous : 📧 amandine@levelupcreation.com | 📞 +32 497 74 69 06"

Reste toujours alignée avec nos valeurs : qualité, accessibilité, proximité et expertise.`
  },
  ...conversationHistory.slice(-10),
  {
    role: "user",
    content: message
  }
];

      logger.info('Appel OpenAI');

      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          temperature: 0.8,
          max_tokens: 500
        })
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        logger.error('Erreur OpenAI', { 
          status: openaiResponse.status,
          error: errorText 
        });
        throw new Error(`OpenAI error: ${openaiResponse.status}`);
      }

      const data = await openaiResponse.json();

      logger.info('Réponse OpenAI OK');

      res.json({
        reply: data.choices[0].message.content.trim(),
        usage: data.usage
      });

    } catch (error) {
      logger.error('Erreur', { error: error.message });
      
      res.status(500).json({
        reply: "Je rencontre un petit souci technique 😅\n\nContacte Amandine :\n📧 amandine@levelupcreation.com\n📞 +32 497 74 69 06"
      });
    }
  }
);