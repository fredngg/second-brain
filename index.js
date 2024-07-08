const express = require('express');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);

// ...other middleware and routes...

// BOT LOGIC
bot.start((ctx) => ctx.reply('Welcome! I am your Telegram bot.'));

// ... (other bot commands, handlers, middleware) ...

// EXPRESS SERVER START
// Setting up an express server with port binding for Heroku's requirement
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);

    // WEBHOOK SETUP (after server is running)
    bot.telegram.setWebhook(`${process.env.HEROKU_APP_URL}`).then(() => {
        console.log('Webhook set!');
    }).catch((error) => {
        console.error("Error setting webhook:", error);
    }); 
}); 