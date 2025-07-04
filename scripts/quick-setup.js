// Quick setup script to configure everything at once
const BOT_TOKEN = "7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34"
const DOMAIN = "https://v0-pepe-case-design.vercel.app"
const WEBHOOK_URL = `${DOMAIN}/api/telegram/webhook`

async function quickSetup() {
  console.log("🚀 Setting up PepeCase Bot...")
  console.log("Domain:", DOMAIN)
  console.log("Webhook:", WEBHOOK_URL)

  try {
    // 1. Test bot connection
    console.log("\n1️⃣ Testing bot connection...")
    const botResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
    const botData = await botResponse.json()

    if (botData.ok) {
      console.log("✅ Bot connected:", botData.result.username)
    } else {
      console.log("❌ Bot error:", botData)
      return
    }

    // 2. Set webhook
    console.log("\n2️⃣ Setting webhook...")
    const webhookResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ["message", "pre_checkout_query"],
        drop_pending_updates: true,
      }),
    })

    const webhookData = await webhookResponse.json()
    if (webhookData.ok) {
      console.log("✅ Webhook set successfully")
    } else {
      console.log("❌ Webhook error:", webhookData)
    }

    // 3. Verify webhook
    console.log("\n3️⃣ Verifying webhook...")
    const infoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)
    const infoData = await infoResponse.json()

    if (infoData.ok) {
      console.log("✅ Webhook info:")
      console.log("  URL:", infoData.result.url)
      console.log("  Pending updates:", infoData.result.pending_update_count)
      console.log("  Last error:", infoData.result.last_error_message || "None")
    }

    // 4. Test app endpoint
    console.log("\n4️⃣ Testing app endpoints...")
    try {
      const testResponse = await fetch(`${DOMAIN}/api/telegram/test-bot`)
      if (testResponse.ok) {
        console.log("✅ App endpoints working")
      } else {
        console.log("⚠️ App endpoint status:", testResponse.status)
      }
    } catch (error) {
      console.log("⚠️ App endpoint test failed:", error.message)
    }

    console.log("\n🎉 Setup complete!")
    console.log("\n📱 Next steps:")
    console.log("1. Open Telegram and search for @Spaceklbot")
    console.log("2. Start the bot and test the web app")
    console.log("3. Try a deposit to test payments")
    console.log("4. Monitor webhook at:", `${DOMAIN}/api/telegram/webhook`)
  } catch (error) {
    console.error("❌ Setup failed:", error)
  }
}

quickSetup()
