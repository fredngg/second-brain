const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const secretPath = `/telegraf/${bot.secretPathComponent()}`;
bot.telegram.setWebhook(`${process.env.HEROKU_APP_URL}${secretPath}`);

bot.start((ctx) => ctx.reply('Welcome! I am your Telegram bot.'));

bot.launch({
    webhook: {
        domain: new URL(process.env.HEROKU_APP_URL).hostname,
        port: process.env.PORT || 8443, // Use the PORT environment variable if available (for Heroku)
    },
});
