import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ====== CONFIG ======
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://levelupcreation.com";

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;     // où tu reçois
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL; // expéditeur SMTP

if (!CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
  console.warn(" CONTACT_TO_EMAIL ou CONTACT_FROM_EMAIL manquant dans .env");
}

// ====== MIDDLEWARES ======
app.use(helmet());

// Autorise uniquement ton site à appeler l'API
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json({ limit: "200kb" }));

// Anti-spam basique (limite de requêtes)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 60, // 60 requêtes / 15min / IP
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

// ====== HEALTH CHECK ======
app.get("/", (req, res) => {
  res.json({ ok: true, name: "Level Up Creation API", time: new Date().toISOString() });
});

// ====== EMAIL TRANSPORT ======
function createTransport() {
  // Option SMTP classique (OVH / Gmail / Sendgrid SMTP)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true", // true si port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeText(v, maxLen = 2000) {
  if (typeof v !== "string") return "";
  return v.replace(/[<>]/g, "").trim().slice(0, maxLen);
}

// ====== CONTACT ENDPOINT ======
app.post("/api/contact", async (req, res) => {
  try {
    // champs attendus côté front
    const name = sanitizeText(req.body?.name, 80);
    const email = sanitizeText(req.body?.email, 120);
    const phone = sanitizeText(req.body?.phone, 40);
    const subject = sanitizeText(req.body?.subject, 120);
    const message = sanitizeText(req.body?.message, 3000);

    // Honeypot anti-bot (champ caché côté front)
    const honey = sanitizeText(req.body?.company, 60);
    if (honey) {
      return res.status(200).json({ ok: true }); // on "fait semblant" pour ne pas aider les bots
    }

    // validations
    if (!name || !message || !isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        error: "Champs invalides. Vérifie nom, email et message."
      });
    }

    const transporter = createTransport();

    const mailText =
`Nouvelle demande depuis levelupcreation.com

Nom: ${name}
Email: ${email}
Téléphone: ${phone || "-"}
Sujet: ${subject || "-"}

Message:
${message}

---
Envoyé depuis Level Up Creation`;

    await transporter.sendMail({
      from: `"Level Up Creation" <${CONTACT_FROM_EMAIL}>`,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: subject ? `${subject}` : " Nouveau message (site)",
      text: mailText
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ /api/contact error:", err);
    return res.status(500).json({ ok: false, error: "Erreur serveur. Réessaie plus tard." });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Allowed origin: ${FRONTEND_ORIGIN}`);
});
