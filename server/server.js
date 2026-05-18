const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from project root so `Contact.html` can be opened at
// http://localhost:PORT/Contact.html and use a relative POST to `/send`.
app.use(express.static(path.join(__dirname, "..")));

// Helpful defaults and config info
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
const DEST_EMAIL = process.env.DEST_EMAIL || SMTP_USER;

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

app.post("/send", async (req, res) => {
  const { name, email, subject, message, consent } = req.body || {};
  if (!subject || !message)
    return res
      .status(400)
      .json({ error: "Missing required fields (subject or message)" });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <h2>Website contact</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Consent stored locally:</strong> ${consent ? "Yes" : "No"}</p>
      <hr />
      <div>${escapeHtml(message).replace(/\n/g, "<br/>")}</div>
    `;

    const mail = {
      from: `"${escapeHtml(name || "Website visitor")}" <${SMTP_FROM}>`,
      to: DEST_EMAIL,
      subject: subject,
      text: `From: ${name} <${email}>\nConsent: ${
        consent ? "Yes" : "No"
      }\n\n${message}`,
      html,
    };

    await transporter.sendMail(mail);
    res.json({ ok: true });
  } catch (err) {
    console.error("Mail send error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Redirect root to the contact page for convenience when browsing the server
app.get("/", (req, res) => res.redirect("/Contact.html"));

// Health endpoint: indicates server is up and whether SMTP env vars are set
app.get("/health", (req, res) => {
  res.json({ ok: true, smtpConfigured: Boolean(SMTP_USER && SMTP_PASS) });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Mailer listening on ${port}`);
  console.log(`Static files served at /Contact.html`);
  console.log(`SMTP configured: ${Boolean(SMTP_USER && SMTP_PASS)}`);
});