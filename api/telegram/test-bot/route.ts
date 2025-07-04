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

export async function GET(request: NextRequest) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json(
        {
          error: "Bot token not configured",
          bot: { ok: false, error: "No bot token" },
          webhook: { ok: false, error: "No bot token" },
          timestamp: new Date().toISOString(),
        },
        { status: 500, headers },
      )
    }

    // Test bot connection
    const botResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
    const botData = await botResponse.json()

    // Test webhook info
    const webhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
    const webhookData = await webhookResponse.json()

    return NextResponse.json(
      {
        bot: botData,
        webhook: webhookData,
        timestamp: new Date().toISOString(),
        success: true,
      },
      { headers },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Test failed",
        success: false,
        timestamp: new Date().toISOString(),
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
