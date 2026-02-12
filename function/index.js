/**
 * Import function triggers from their respective submodules:
 * https://firebase.google.com/docs/functions
 */
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Petite fonction test : https://<ton-url>/hello
exports.hello = onRequest((req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.status(200).send("Hello from Level Up Creation Functions!");
});
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.hello = onRequest((req, res) => {
  logger.info("Hello from Level Up Creation!", { structuredData: true });
  res.status(200).send("Hello from Level Up Creation Functions!");
});
