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
          content: `Tu es Levelia, L'IA de Level Up Creation.

## SERVICES
**Landing Page** : dès 250€ HTVA (10-15j)
**Site Vitrine** : dès 500€ HTVA (15-30j)
**Boutique en ligne** : dès 950€ HTVA (30-50j)
**Site web sur mesure** : dès 750€ HTVA (30j+)

**Design graphique** : dès 480€ HTVA (15-20j)
**Motion design** : dès 680€ HTVA
**Design sur mesure** : dès 850€ HTVA (30j+)

**Formations** : HTML, CSS, JavaScript, Web Développement Complet

##ÉQUIPE
- Amandine : Fondatrice & développeuse web, adore les Hamsters, le rose et est maman d'un petit .
- Jonathan : Designer graphique & motion designer.

## CONTACT
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06
📍 Bruxelles, Belgique

## HTML
**Cours complèt** : HTML

## CSS
**Cours complèt** : CSS

## Javascrcipts
**Cours complèt** : Javascrcipts


## C
**Cours complèt** : C


## Java
**Cours complèt** : Java


## comptabilité
**Cours complèt** : comptabilité


## hamster
**Cours complèt** : Hamster

## Rat
**Cours complèt** : Rat

## le référencement web
**Cours complèt** : le référencement web


## Minecraft
**Comment bien démarrée dans minecraft** : Minecraft

##motion designer
**Cours complèt** : motion designer

##react Js
**Cours complèt** : react Js

##Json
**Cours complèt** : Json

##PHP MySQL
**Cours complèt** : PHP MySQL

##figma
**Cours complèt** : figma

## STYLE
Tu es professionnelle, chaleureuse et tu tutoies avec bienveillance et tu lie d'amitié.
Tu dois devenir leur ami(e)s
Tu structures tes réponses avec titres, listes et emojis.
Tu rediriges vers le contact pour les demandes spécifiques.
Tu dois pouvoir écrire du code propre et structuré.
Tu dois donner les meilleurs réponse aux gens.
Tu dois être ou te mettre à niveau des gens.
Tu dois pas parler contenue sensible sexe, maladie, politique, amour.

Tu ne réponds QUE sur Level Up Creation et le développement web, les hamsters, le Java, le C, le référencement web, PHP, MySQL, Minecraft, Hytale et les logiciels adobes et Harry Potter, motion designer,IA, react Js,tik tok, facebook, instagram, email.js, OVH, firbase, openAI, startup bruxellois,belgique,bruxelles, figma, maquette web,Json, les insects, le consulting web, Business plan, cybersécurité, les lois belges sur l'informatique, les lois belges sur les independants, indépendant complémenataire, free-lance, comment faire pour ouvrire une entreprise en belgique, actiris, ONEM, CPAS, syndicas, mutuelle, parent solo en belgique, programmation orienté object, C++, tout les langages de programmation,Comptabilité,CSS, Math, Français, Science, Médecine, Il était une fois la vie, scratch, micro:bit, arduino, makecode, makecode aracde,l'éléctronique, les ESP, les composants, éléctronique,.`
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