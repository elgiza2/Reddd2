// Test script to verify bot is working
const BOT_TOKEN = "7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34"

async function testBot() {
  try {
    console.log("Testing bot connection...")

    // Test bot info
    const botResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
    const botData = await botResponse.json()

    if (botData.ok) {
      console.log("✅ Bot is working!")
      console.log("Bot info:", botData.result)
    } else {
      console.log("❌ Bot error:", botData)
    }

    // Test webhook info
    console.log("\nChecking webhook...")
    const webhookResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)
    const webhookData = await webhookResponse.json()

    if (webhookData.ok) {
      console.log("✅ Webhook info:")
      console.log(webhookData.result)
    } else {
      console.log("❌ Webhook error:", webhookData)
    }
  } catch (error) {
    console.error("Error testing bot:", error)
  }
}

testBot()
