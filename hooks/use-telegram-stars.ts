"use client"

import { useState } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import { useSound } from "@/hooks/use-sound"

export function useTelegramStars() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { webApp, user, showAlert } = useTelegram()
  const { playSound } = useSound()

  const createStarPayment = async (tonAmount: number, description: string) => {
    if (!user) {
      throw new Error("User not available")
    }

    setIsProcessing(true)
    setError(null)
    playSound("click")

    try {
      // Convert TON to Stars (1 TON = 100 Stars)
      const starsAmount = Math.floor(tonAmount * 100)

      console.log("Creating Stars invoice:", { tonAmount, starsAmount, userId: user.id })

      // Create request payload
      const requestPayload = {
        userId: user.id,
        amount: starsAmount,
        tonAmount: tonAmount,
        description: description,
        payload: `stars_deposit_${user.id}_${Date.now()}`,
      }

      console.log("Sending request:", requestPayload)

      // Create Stars invoice through our API with better error handling
      const response = await fetch("/api/telegram/create-stars-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestPayload),
      })

      console.log("API response status:", response.status)
      console.log("API response headers:", Object.fromEntries(response.headers.entries()))

      // Check if response is ok
      if (!response.ok) {
        console.error("API response not ok:", response.status, response.statusText)

        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorText = await response.text()
          console.error("Error response text:", errorText)

          if (errorText.trim()) {
            try {
              const errorData = JSON.parse(errorText)
              errorMessage = errorData.error || errorMessage
            } catch {
              // If not JSON, use the text as is
              errorMessage = errorText.substring(0, 100) // Limit length
            }
          }
        } catch (textError) {
          console.error("Failed to read error response:", textError)
        }

        throw new Error(errorMessage)
      }

      // Parse response safely
      let data
      try {
        const responseText = await response.text()
        console.log("API response text:", responseText)

        if (!responseText.trim()) {
          throw new Error("Empty response from server")
        }

        data = JSON.parse(responseText)
        console.log("Parsed response data:", data)
      } catch (parseError) {
        console.error("Failed to parse response JSON:", parseError)
        throw new Error("Invalid response format from server")
      }

      // Check if the API call was successful
      if (!data.success) {
        throw new Error(data.error || "Failed to create Stars invoice")
      }

      if (!data.invoice_link) {
        throw new Error("No invoice link received from server")
      }

      console.log("Invoice created successfully:", data.invoice_link)

      // Open the invoice in Telegram
      if (webApp && webApp.openLink) {
        console.log("Opening invoice link in Telegram WebApp:", data.invoice_link)
        webApp.openLink(data.invoice_link)
      } else {
        // Fallback: open in new window
        console.log("Opening invoice link in new window")
        window.open(data.invoice_link, "_blank")
      }

      // Show success message
      showAlert(`✅ Stars invoice created! Complete the payment in Telegram.`)

      setIsProcessing(false)
      return true
    } catch (error) {
      setIsProcessing(false)
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      setError(errorMessage)
      console.error("Stars payment failed:", error)
      playSound("error")
      showAlert(`❌ Payment failed: ${errorMessage}`)
      throw error
    }
  }

  return {
    createStarPayment,
    isProcessing,
    error,
  }
}
