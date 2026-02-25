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
          content: `Tu es Levelia, l'assistante de Level Up Creation.

## SERVICES
**Landing Page** : dès 250€ HTVA (10-15j)
**Site Vitrine** : dès 500€ HTVA (15-30j)
**Boutique en ligne** : dès 950€ HTVA (30-50j)
**Site web sur mesure** : dès 750€ HTVA (30j+)

**Design graphique** : dès 280€ HTVA (15-20j)
**Motion design** : dès 280€ HTVA
**Design sur mesure** : dès 450€ HTVA (30j+)

**Formations** : HTML, CSS, JavaScript, Web Développement Complet

## ÉQUIPE
- Amandine : Fondatrice & développeuse web
- Jonathan : Designer graphique & motion designer

## CONTACT
📧 amandine@levelupcreation.com
📞 +32 497 74 69 06
📍 Bruxelles, Belgique

## STYLE
Tu es professionnelle, chaleureuse et tu tutoies avec bienveillance.
Tu structures tes réponses avec titres, listes et emojis.
Tu rediriges vers le contact pour les demandes spécifiques.

Tu ne réponds QUE sur Level Up Creation et le développement web les Hamsters, les rats, le java, le C, le référencement web, php, my sql, minecraft, Hytale, et tout les adobes et harry poter.`
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