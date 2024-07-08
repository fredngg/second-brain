const { Telegraf } = require('telegraf');
require('dotenv').config();
const express = require('express')
const expressApp = express()

const bot = new Telegraf(process.env.BOT_TOKEN);
const secretPath = `/telegraf/${bot.secretPathComponent()}`;
//bot.telegram.setWebhook(`${process.env.HEROKU_APP_URL}${secretPath}`);

const port = process.env.PORT || 3000
expressApp.get('/', (req, res) => {
  res.send('This is Fred - Second Brain UI.')
})
expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

bot.start((ctx) => ctx.reply('Welcome! I am your Telegram bot.'));

const PORT = process.env.PORT || 3000;
bot.launch(); 
/*
bot.launch({
  webhook: {
    domain: new URL(process.env.HEROKU_APP_URL).hostname,
    port: PORT,
  },
});*/
