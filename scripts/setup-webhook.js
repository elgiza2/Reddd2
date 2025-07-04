// Run this script to set up the Telegram webhook
const TELEGRAM_BOT_TOKEN = "your_bot_token_here"
const WEBHOOK_URL = "https://your-domain.vercel.app/api/telegram/webhook"

async function setupWebhook() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ["message", "pre_checkout_query"],
      }),
    })

    const data = await response.json()
    console.log("Webhook setup result:", data)
  } catch (error) {
    console.error("Failed to setup webhook:", error)
  }
}

setupWebhook()
