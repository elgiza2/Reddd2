import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, invoice } = await request.json()
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json({ error: "Bot token not configured" }, { status: 500 })
    }

    // Create invoice using Telegram Bot API
    const response = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    })

    if (!response.ok) {
      throw new Error("Failed to create invoice")
    }

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || "Failed to create invoice")
    }

    return NextResponse.json({
      invoice_link: data.result,
      success: true,
    })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
