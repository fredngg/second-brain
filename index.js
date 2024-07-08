const express = require("express");
const bodyParser = require("body-parser");
const { Telegraf } = require("telegraf");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);
const AUTHORIZED_TELEGRAM_ID = parseInt(process.env.TELEGRAM_ID, 10);

// BOT LOGIC (with Authentication and Dynamic Webhook)
app.use(bodyParser.json()); // Parse incoming JSON payloads

app.use(bot.webhookCallback("/"));

bot.use(async (ctx, next) => {
  const update = ctx.update; // Use ctx.update instead of req.body

  // Middleware to filter empty payloads
  if (Object.keys(update).length === 0 && update.constructor === Object) {
    console.log("Empty update received - Ignoring");
    return; // No need to send a response here, just stop processing
  }

  // Authentication Middleware
  if (update.message && update.message.from) {
    const telegramId = update.message.from.id;
    const telegramName =
      update.message.from.first_name + " " + update.message.from.last_name;
    if (telegramId !== AUTHORIZED_TELEGRAM_ID) {
      await ctx.reply("This is not available to you."); // Use ctx.reply directly
      return; // Stop processing the update
    }
  }
  console.log("it comes here");
  // Continue to the next middleware or handler if authorized
  await next();
});

// ... (rest of your bot commands, handlers, middleware) ...
console.log("It is here");

// EXPRESS SERVER START for Heroku to avoid port binding error after 60 seconds
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
