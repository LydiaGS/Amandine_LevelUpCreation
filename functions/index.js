const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.hello = onRequest((req, res) => {
  logger.info("Hello from Level Up Creation!", {structuredData: true});
  res.status(200).send("Hello from Level Up Creation Functions!");
});
