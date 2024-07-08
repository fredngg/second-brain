const express = require("express");
const bodyParser = require("body-parser");
const { Telegraf } = require("telegraf");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);
const AUTHORIZED_TELEGRAM_ID = process.env.TELEGRAM_ID; 

// BOT LOGIC (with Authentication and Dynamic Webhook)
app.use(bodyParser.json()); // Parse incoming JSON payloads

// Middleware to filter empty payloads (remains unchanged)
app.use((req, res, next) => {
  // Check if the payload is an empty object
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    console.log("Empty payload received - Ignoring");
    return res.sendStatus(200); // Send an OK response to avoid errors
  }
  console.log('passes this part'); 
  next(); // Continue processing if the payload is not empty
});

app.use(async (req, res, next) => {
  console.log('here'); 
  const incomingRes = req.body;
  if (incomingRes && incomingRes.message && incomingRes.message.from) {
    const telegramId = incomingRes.message.from.id;
    const telegramName = incomingRes.message.from.first_name + ' ' + incomingRes.message.from.last_name; 
    if (telegramId !== AUTHORIZED_TELEGRAM_ID) {
      await bot.telegram.sendMessage(
        telegramName,
        "This is not available to you."
      );
      console.log("this is working"); 
      return res.sendStatus(200); // Stop further processing
    }
  }
  next(); // Continue to webhook if authorized
});

// Dynamic Webhook Setup and Handling
app.use(async (req, res, next) => {
  try {
    const webhookInfo = await bot.telegram.getWebhookInfo();
    if (!webhookInfo.url) {
      // Webhook not set, set it now
      await bot.telegram.setWebhook(`${process.env.HEROKU_APP_URL}`);
      console.log("Webhook set!");
    }

    // If webhook is set, proceed with the callback
    return next();
  } catch (error) {
    console.error("Error setting/checking webhook:", error);
    return res.sendStatus(500); // Internal Server Error
  }
});

app.use(bot.webhookCallback("/"));

// ... (rest of your bot commands, handlers, middleware) ...

// EXPRESS SERVER START
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
