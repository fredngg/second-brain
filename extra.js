// Not used. To be refactored
// Dynamic Webhook Setup and Handling
app.use(async (req, res, next) => {
    try {
      const webhookInfo = await bot.telegram.getWebhookInfo();
      if (!webhookInfo.url) {
        // Webhook not set, set it now
        await bot.telegram.setWebhook(`${process.env.HEROKU_APP_URL}`);
        console.log("Webhook set!");
      } else {
        console.log("Webhook is already set:", webhookInfo.url); // Log if set
      }
      // If webhook is set, proceed with the callback
      return next();
    } catch (error) {
      console.error("Error setting/checking webhook:", error);
      return res.sendStatus(500); // Internal Server Error
    }
  });