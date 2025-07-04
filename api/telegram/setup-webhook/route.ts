import { type NextRequest, NextResponse } from "next/server"

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    }

    console.log("=== Webhook Setup Started ===")

    let requestData
    try {
      requestData = await request.json()
    } catch (error) {
      console.error("JSON parse error:", error)
      return NextResponse.json({ error: "Invalid JSON in request", success: false }, { status: 400, headers })
    }

    const { webhookUrl } = requestData
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      console.error("Bot token not configured")
      return NextResponse.json({ error: "Bot token not configured", success: false }, { status: 500, headers })
    }

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL is required", success: false }, { status: 400, headers })
    }

    console.log("Setting up webhook:", webhookUrl)

    // Step 1: Test bot connection first
    console.log("Step 1: Testing bot connection...")
    const botTestResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
    const botTestData = await botTestResponse.json()

    if (!botTestData.ok) {
      console.error("Bot test failed:", botTestData)
      return NextResponse.json(
        {
          error: `Bot connection failed: ${botTestData.description}`,
          success: false,
          step: "bot_test",
        },
        { status: 400, headers },
      )
    }

    console.log("✅ Bot connection successful:", botTestData.result.username)

    // Step 2: Set webhook
    console.log("Step 2: Setting webhook...")
    const webhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message", "pre_checkout_query"],
        drop_pending_updates: true,
      }),
    })

    const webhookData = await webhookResponse.json()
    console.log("Webhook setup response:", webhookData)

    if (!webhookData.ok) {
      console.error("❌ Failed to set webhook:", webhookData)
      return NextResponse.json(
        {
          error: `Webhook setup failed: ${webhookData.description}`,
          success: false,
          step: "webhook_setup",
          details: webhookData,
        },
        { status: 400, headers },
      )
    }

    console.log("✅ Webhook set successfully")

    // Step 3: Verify webhook info
    console.log("Step 3: Verifying webhook...")
    const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
    const infoData = await infoResponse.json()

    console.log("Webhook verification:", infoData)

    // Step 4: Test webhook endpoint
    console.log("Step 4: Testing webhook endpoint...")
    const endpointTest = { accessible: false, error: null }
    try {
      const testResponse = await fetch(webhookUrl.replace("/webhook", "/test-bot"))
      endpointTest.accessible = testResponse.ok
    } catch (error) {
      endpointTest.error = error instanceof Error ? error.message : "Unknown error"
    }

    const result = {
      success: true,
      message: "Webhook configured successfully",
      bot: {
        username: botTestData.result.username,
        id: botTestData.result.id,
        can_receive_payments: botTestData.result.can_receive_payments || false,
      },
      webhook: {
        url: infoData.result?.url,
        has_custom_certificate: infoData.result?.has_custom_certificate,
        pending_update_count: infoData.result?.pending_update_count,
        last_error_date: infoData.result?.last_error_date,
        last_error_message: infoData.result?.last_error_message,
        max_connections: infoData.result?.max_connections,
        allowed_updates: infoData.result?.allowed_updates,
      },
      endpoint_test: endpointTest,
      setup_time: new Date().toISOString(),
    }

    console.log("=== Webhook Setup Complete ===")
    console.log("Final result:", result)

    return NextResponse.json(result, { headers })
  } catch (error) {
    console.error("Unexpected error setting webhook:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to set webhook",
        success: false,
        step: "unexpected_error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    )
  }
}
