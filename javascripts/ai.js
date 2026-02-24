const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const fetch = require("node-fetch");

const openaiKey = defineSecret("OPENAI_KEY");

exports.chatAI = onRequest(
  {
    cors: ["https://levelupcreation.com"], // 🔒 Autorise uniquement TON domaine
    secrets: [openaiKey],
  },
  async (req, res) => {

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const userMessage = req.body.message;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey.value()}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
Tu es l'assistante officielle de Level Up Creation.

Tu réponds uniquement aux questions liées :
- aux services web
- aux tarifs
- aux formations
- à l'équipe
- au développement web (HTML, CSS, JS)

Tu parles avec un ton :
- chaleureux
- professionnel
- rassurant
- premium

Tu rediriges vers le formulaire de contact si nécessaire.
              `
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();

      res.json({
        reply: data.choices[0].message.content
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        reply: "Une petite erreur technique 💗 Réessaie dans un instant."
      });
    }
  }
);
async function envoyerMessage() {
  const texte = input.value.trim();
  if (!texte) return;

  ajouterMessage(texte, "user");
  input.value = "";

  afficherTyping();

  try {

    const response = await fetch(
      "https://us-central1-amandinelevelupcreation.cloudfunctions.net/chatAI",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: texte })
      }
    );

    const data = await response.json();

    retirerTyping();
    ajouterMessage(data.reply, "bot");

  } catch (error) {
    retirerTyping();
    ajouterMessage("Une erreur est survenue 💗", "bot");
  }
}