const { Telegraf } = require('telegraf');
require('dotenv').config(); // Load environment variables

const bot = new Telegraf(process.env.BOT_TOKEN); // Use your token
bot.start((ctx) => ctx.reply('Welcome! I am your Telegram bot.'));

// More logic to be added

bot.launch(); 

