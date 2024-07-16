import express from "express";
import bodyParser from "body-parser";
import { Telegraf } from "telegraf";
import { ChatOpenAI } from "langchain/llms/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import dotenv from "dotenv";

// import prompt templates
import { intentClassificationPromptTemplate } from "./prompts.js"; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);
const AUTHORIZED_TELEGRAM_ID = parseInt(process.env.TELEGRAM_ID, 10);

console.log("hey");
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
    update.message.from.first_name + " " + update.message.from.last_name;
    if (telegramId !== AUTHORIZED_TELEGRAM_ID) {
      await ctx.reply("This is not available to you.");
      return;
    }
  }
  // Continue to the next middleware or handler if authorized
  await next();
});

// Message Handler (both text and voice)

bot.on(message(["text", "voice"]), async (ctx) => {
  try {
    let userInput;
    if (ctx.message.voice) {
      // Handle voice message
      const fileId = ctx.message.voice.file_id;
      //userInput = await transcribeVoice(fileId);
    } else if (ctx.message.text) {
      // Handle text message
      userInput = ctx.message.text;
      console.log(userInput);
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

// Initialize OpenAI Model
const intentClassificationModel = new ChatOpenAI({
  modelName: "gpt-4",
  openAIApiKey: process.env.OPENAI_KEY, 
});

// User Intent Function
async function handleUserInput(ctx, userInput) {
  try {
    const chain = intentClassificationPromptTemplate.pipe(
      intentClassificationModel
    );
    const response = await chain.invoke({ userInput });

    // Extract and clean the intent
    const classifiedIntent = response.text.toLowerCase().trim();

    const validIntents = ["remember", "retrieve", "converse"];
    const intent = validIntents.includes(classifiedIntent)
      ? classifiedIntent
      : "converse"; // Default to 'converse' if invalid

    // Now use the 'intent' variable in your logic
    if (intent === "remember") {
      // ... logic to remember information ...
    } else if (intent === "retrieve") {
      // ... logic to retrieve information ...
    } else {
      // ... logic for general conversation ...
    }
  } catch (error) {
    console.error("Error in handleUserInput:", error);
    ctx.reply("An error occurred while processing your request.");
  }
}

// EXPRESS SERVER START for Heroku to avoid port binding error after 60 seconds
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
