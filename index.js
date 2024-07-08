const express = require('express');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);

// ...other middleware and routes...

// BOT LOGIC
bot.start((ctx) => ctx.reply('Welcome! I am your Telegram bot.'));

bot.hears(/^(?!\/).+/, (ctx) => { // Match any text that doesn't start with '/'
    console.log('Received Text Message:', ctx.message.text);
});
  
// ... (other bot commands, handlers, middleware) ...

// WEBHOOK SETUP (Integrated with Express)
app.use(bodyParser.json());  // Parse incoming JSON payloads

// Middleware to log the parsed JSON body
app.use((req, res, next) => {
    if (req.body) { // Check if there is a request body to log
      console.log('Received JSON Payload:', req.body);
    }
    next(); // Important: Call next() to continue processing the request
  });
  
app.use(bot.webhookCallback('/'));  // Mount Telegraf's webhook middleware

// EXPRESS SERVER START
// Setting up an express server with port binding for Heroku's requirement
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    // Informational log:
    console.log(`Webhook is set to: ${process.env.HEROKU_APP_URL}`); 
});

/* Set once. Don't need to set again. Will refactor in the future
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);

    // WEBHOOK SETUP (after server is running)
    bot.telegram.setWebhook(`${process.env.HEROKU_APP_URL}`).then(() => {
        console.log('Webhook set!');
    }).catch((error) => {
        console.error("Error setting webhook:", error);
    }); 
}); 
*/