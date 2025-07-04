import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    console.log("Webhook received:", JSON.stringify(update, null, 2))

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error("Bot token not configured")
      return NextResponse.json({ error: "Bot token not configured" }, { status: 500 })
    }

    // Handle pre-checkout query (approve payment before processing)
    if (update.pre_checkout_query) {
      const preCheckoutQuery = update.pre_checkout_query
      console.log("Pre-checkout query:", preCheckoutQuery)

      try {
        // Answer pre-checkout query (approve payment)
        const approveResponse = await fetch(`https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pre_checkout_query_id: preCheckoutQuery.id,
            ok: true,
          }),
        })

        const approveData = await approveResponse.json()
        console.log("Pre-checkout approval response:", approveData)

        if (!approveData.ok) {
          console.error("Failed to approve pre-checkout:", approveData)
        }
      } catch (error) {
        console.error("Error approving pre-checkout:", error)
      }

      return NextResponse.json({ success: true })
    }

    // Handle successful payment confirmation
    if (update.message && update.message.successful_payment) {
      const payment = update.message.successful_payment
      const userId = update.message.from.id

      console.log("Successful payment:", payment)
      console.log("User ID:", userId)

      try {
        // Extract payment data
        let tonAmount = 1 // Default

        // Try to extract TON amount from provider data
        if (payment.provider_payment_charge_id) {
          try {
            const providerData = JSON.parse(payment.provider_payment_charge_id)
            tonAmount = providerData.tonAmount || 1
          } catch (e) {
            console.log("Could not parse provider data, using default")
          }
        }

        // Try to extract from invoice payload
        if (payment.invoice_payload && payment.invoice_payload.includes("stars_deposit_")) {
          const parts = payment.invoice_payload.split("_")
          if (parts.length >= 4) {
            // Extract TON amount from Stars amount (divide by 100)
            const starsAmount = payment.total_amount
            tonAmount = starsAmount / 100
          }
        }

        console.log("Processing payment:", { userId, tonAmount, starsAmount: payment.total_amount })

        // Update user balance in your database/storage
        await updateUserBalance(userId, tonAmount)

        // Send confirmation message
        const confirmResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: userId,
            text: `✅ Stars payment successful!\n\n💰 ${tonAmount} TON has been added to your PepeCase balance.\n\n⭐ You paid ${payment.total_amount} Telegram Stars`,
            parse_mode: "HTML",
          }),
        })

        const confirmData = await confirmResponse.json()
        console.log("Confirmation message response:", confirmData)

        // Update payment record status
        await updatePaymentRecord(payment.telegram_payment_charge_id, "completed", {
          userId,
          tonAmount,
          starsAmount: payment.total_amount,
          completedAt: new Date(),
        })
      } catch (error) {
        console.error("Error processing successful payment:", error)

        // Send error message to user
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: userId,
              text: "❌ There was an error processing your Stars payment. Please contact support.",
            }),
          })
        } catch (msgError) {
          console.error("Failed to send error message:", msgError)
        }
      }

      return NextResponse.json({ success: true })
    }

    // Handle other message types
    if (update.message) {
      console.log("Regular message received:", update.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

// Update user balance (implement with your database)
async function updateUserBalance(userId: number, amount: number) {
  console.log(`Updating balance for user ${userId}: +${amount} TON`)

  try {
    if (typeof window === "undefined") {
      const fs = require("fs").promises
      const path = require("path")
      const balancesPath = path.join(process.cwd(), "user-balances.json")

      let balances: Record<string, number> = {}
      try {
        const existingData = await fs.readFile(balancesPath, "utf8")
        balances = JSON.parse(existingData)
      } catch (error) {
        // File doesn't exist yet, start with empty object
      }

      balances[userId.toString()] = (balances[userId.toString()] || 0) + amount
      await fs.writeFile(balancesPath, JSON.stringify(balances, null, 2))

      console.log(`Balance updated: User ${userId} now has ${balances[userId.toString()]} TON`)
    }
  } catch (error) {
    console.error("Failed to update user balance:", error)
  }
}

// Update payment record status
async function updatePaymentRecord(paymentId: string, status: string, data: any) {
  console.log(`Updating payment record ${paymentId} to status: ${status}`)

  try {
    if (typeof window === "undefined") {
      const fs = require("fs").promises
      const path = require("path")
      const recordsPath = path.join(process.cwd(), "payment-records.json")

      let records = []
      try {
        const existingData = await fs.readFile(recordsPath, "utf8")
        records = JSON.parse(existingData)
      } catch (error) {
        // File doesn't exist yet
        return
      }

      // Find and update the record
      const recordIndex = records.findIndex((r: any) => r.paymentId === paymentId)
      if (recordIndex !== -1) {
        records[recordIndex] = { ...records[recordIndex], status, ...data }
        await fs.writeFile(recordsPath, JSON.stringify(records, null, 2))
        console.log("Payment record updated successfully")
      }
    }
  } catch (error) {
    console.error("Failed to update payment record:", error)
  }
}
