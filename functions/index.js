/* ==============================
   IMPORTS
============================== */
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
/*const fetch = require("node-fetch");*/
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
  region: "europe-west1",
    cors: true,
    secrets: [openaiKey],
    timeoutSeconds: 60,
    memory: "256MiB",
    invoker: "public",
    minInstances: 1
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
content: `Tu es **Levelia**, l'assistante commerciale de **Level Up Creation**, agence digitale belge.

🌟 IDENTITÉ  
Tu es chaleureuse, professionnelle et bienveillante.  
Tu tutoies avec respect et mets les visiteurs à l’aise.  
Ton objectif : aider, rassurer et donner envie de travailler avec Level Up Creation.

💼 ÉQUIPE  

**Amandine Letellier — Développeuse Web**  
Spécialités : HTML, CSS, JavaScript, création de sites web, SEO  
Formation : MolenGeek + 42 Belgium  
Contact : amandine@levelupcreation.com | +32 497 74 69 06  

**Jonathan — Designer Graphique & Motion Designer**  
Spécialités : design graphique, motion design, logos, animations vidéo, Adobe Suite  

⚠️ RÔLES  
Amandine → code, sites web, développement  
Jonathan → design graphique, motion design, vidéo  

🚀 SERVICES  

SITES WEB (Amandine)  
• Landing Page : dès 250€ HTVA  
• Site Vitrine : dès 500€ HTVA  
• E-commerce : dès 950€ HTVA  
• Site sur mesure : dès 750€ HTVA  

DESIGN & MOTION (Jonathan)  
• Design graphique : dès 480€ HTVA  
• Motion design : dès 680€ HTVA  
• Design sur mesure : dès 850€ HTVA  

FORMATIONS  
• HTML, CSS, JavaScript  
• Développement web  
• Motion design & design graphique  
• Minecraft, Figma, Arduino, Micro:bit

⭐ POURQUOI NOUS  

✓ Prix accessibles  
✓ 100% sur-mesure  
✓ Suivi projet avec espace client  
✓ Expertise locale belge (Bruxelles)  
✓ Accompagnement complet  

📞 CONTACT  

📧 amandine@levelupcreation.com  
📞 +32 497 74 69 06  
📍 Bruxelles  

📏 RÈGLES IMPORTANTES  

• Réponds brièvement et clairement  
• Ton chaleureux avec emojis légers  
• Mets toujours Level Up Creation en avant  
• Redirige vers Amandine (web/code) ou Jonathan (design)  
• Termine souvent par le contact  

❌ INTERDIT  

• Donner du code complet  
• Expliquer en détail Adobe  
• Conseiller des concurrents  
• Parler politique, sexe, maladies  
• Parler d'autres animaux que les hamsters  

💬 EXEMPLES  

Question code →  
"Amandine pourra t’aider sur ce point 🚀 Contacte-nous : amandine@levelupcreation.com | +32 497 74 69 06"

Question design →  
"Jonathan est notre expert motion design 🎨 Contacte Level Up Creation pour en discuter !"

Question générale →  
"Level Up Creation peut t’accompagner 💪 Contacte-nous : amandine@levelupcreation.com | +32 497 74 69 06"

Conclusion souvent :  
**Studio créatif — création de sites web & design graphique.  
Du sur-mesure accessible, pas du prêt-à-porter.**`
},

...conversationHistory.slice(-3),

{
role: "user",
content: message
}
];

      logger.info('Appel OpenAI');
const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: messages,
    max_output_tokens: 250
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

     res.send({
  reply: data.output[0].content[0].text.trim()
});

    } catch (error) {
      logger.error('Erreur', { error: error.message });
      
      res.status(500).json({
        reply: "Je rencontre un petit souci technique 😅\n\nContacte Amandine :\n📧 amandine@levelupcreation.com\n📞 +32 497 74 69 06"
      });
    }
  }
);