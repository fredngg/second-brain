import { intentClassificationPromptTemplate } from "./prompts.js"; 

export const intentClassificationPromptTemplate = new PromptTemplate({
    template: `
      You are tasked with classifying the user's intent based on their message. The possible intents are:
      - "remember": The user wants the bot to remember some information.
      - "retrieve": The user wants the bot to recall previously stored information.
  
      Classify the following message and return ONLY the intent in lowercase:
      
      Message: {userInput}
      Intent: 
    `,
    inputVariables: ["userInput"]
  });
  