import express from "express";
import bodyParser from "body-parser";
import { Telegraf } from "telegraf";
//import { ChatOpenAI } from "langchain/llms/openai";
//import { ChatPromptTemplate,  HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);
const AUTHORIZED_TELEGRAM_ID = parseInt(process.env.TELEGRAM_ID, 10);

console.log('hey');
// BOT AUTHENTICATION AND CALLBACK
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
    console.log('it went here first'); 
      update.message.from.first_name + " " + update.message.from.last_name;
    if (telegramId !== AUTHORIZED_TELEGRAM_ID) {
      await ctx.reply("This is not available to you.");
      return;
    }
  }
  // Continue to the next middleware or handler if authorized
  await next();
});

/*
// Message Handler (both text and voice)

bot.on(message(["text", "voice"]), async (ctx) => { 
    console.log('it went here 2'); 
    try {
        let userInput;
        if (ctx.message.voice) {
            // Handle voice message
            const fileId = ctx.message.voice.file_id;
            userInput = await transcribeVoice(fileId); 
        } else if (ctx.message.text) {
            // Handle text message
            userInput = ctx.message.text;
        } else {
            ctx.reply("Sorry, I can only handle text or voice messages.");
            return;
        }

        // Call the user intent function
        await handleUserInput(ctx, userInput);
    } catch (error) {
        console.error("Error handling message:", error);
        ctx.reply("An error occurred. Please try again later.");
    }
});

// User Intent Function (as provided)
async function handleUserInput(ctx, userInput) {
    const intent = determineIntent(userInput);
    const promptTemplate = getPromptTemplateForIntent(intent);
    const chainValues = { userInput };
    const response = await chain.call(chainValues); 
    ctx.reply(response.text);
}
*/ 

// EXPRESS SERVER START for Heroku to avoid port binding error after 60 seconds
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
