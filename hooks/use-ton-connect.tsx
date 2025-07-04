"use client"

import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { useState, useCallback, useEffect, useRef } from "react"
import { useSound } from "@/hooks/use-sound"
import { useTelegram } from "@/hooks/use-telegram"

const PEPECASE_WALLET = "UQDpWr5-kwW8BF2bsqi7v82gjDoR6E71wvf0vGVWKUMSvV0Q"

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { playSound } = useSound()
  const { showAlert, hapticFeedback } = useTelegram()

  // Use refs to track ongoing operations and prevent race conditions
  const operationRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  const isConnected = !!wallet
  const walletAddress = wallet?.account?.address

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (operationRef.current) {
        operationRef.current.abort()
      }
    }
  }, [])

  // Helper function to safely update state
  const safeSetState = useCallback((setter: () => void) => {
    if (mountedRef.current) {
      setter()
    }
  }, [])

  const connectWallet = useCallback(async () => {
    // Prevent multiple simultaneous connection attempts
    if (isProcessing || !mountedRef.current) {
      return
    }

    try {
      safeSetState(() => {
        setError(null)
        setIsProcessing(true)
      })

      playSound("click")
      hapticFeedback("light")

      // Cancel any existing operation
      if (operationRef.current) {
        operationRef.current.abort()
      }

      // Create new abort controller for this operation
      operationRef.current = new AbortController()

      if (!tonConnectUI.connected) {
        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          if (operationRef.current) {
            operationRef.current.abort()
          }
        }, 30000) // 30 second timeout

        try {
          await tonConnectUI.openModal()
          clearTimeout(timeoutId)
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }
      }

      // Clear the operation reference on success
      operationRef.current = null
    } catch (error) {
      console.error("Failed to connect wallet:", error)

      // Handle specific TON Connect errors
      if (error instanceof Error) {
        if (error.message.includes("aborted") || error.message.includes("Operation aborted")) {
          safeSetState(() => setError("Connection cancelled"))
        } else if (error.message.includes("rejected")) {
          safeSetState(() => setError("Connection rejected by user"))
        } else {
          safeSetState(() => setError("Failed to connect wallet"))
        }
      } else {
        safeSetState(() => setError("Failed to connect wallet"))
      }

      playSound("error")
    } finally {
      safeSetState(() => setIsProcessing(false))
      operationRef.current = null
    }
  }, [tonConnectUI, playSound, hapticFeedback, isProcessing, safeSetState])

  const disconnectWallet = useCallback(async () => {
    if (isProcessing || !mountedRef.current) {
      return
    }

    try {
      safeSetState(() => {
        setError(null)
        setIsProcessing(true)
      })

      playSound("click")

      // Cancel any existing operation
      if (operationRef.current) {
        operationRef.current.abort()
      }

      await tonConnectUI.disconnect()

      if (mountedRef.current) {
        showAlert("Wallet disconnected successfully")
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
      safeSetState(() => setError("Failed to disconnect wallet"))
      playSound("error")
    } finally {
      safeSetState(() => setIsProcessing(false))
    }
  }, [tonConnectUI, playSound, showAlert, isProcessing, safeSetState])

  // Simplified payment method without payload to avoid encoding issues
  const sendTonPayment = useCallback(
    async (amount: number, description?: string) => {
      if (!isConnected || !walletAddress || isProcessing || !mountedRef.current) {
        throw new Error("Wallet not connected or operation in progress")
      }

      try {
        safeSetState(() => {
          setIsProcessing(true)
          setError(null)
        })

        playSound("click")
        hapticFeedback("medium")

        // Cancel any existing operation
        if (operationRef.current) {
          operationRef.current.abort()
        }

        // Create new abort controller
        operationRef.current = new AbortController()

        // Convert TON to nanotons (1 TON = 1,000,000,000 nanotons)
        const nanotons = Math.floor(amount * 1000000000).toString()

        console.log("Payment details:", {
          amount: amount,
          nanotons: nanotons,
          walletAddress: walletAddress,
          targetAddress: PEPECASE_WALLET,
          description: description || "No comment",
        })

        // Simple transaction without payload to avoid encoding issues
        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
          messages: [
            {
              address: PEPECASE_WALLET,
              amount: nanotons,
              // No payload - this was causing the "Invalid data format" error
            },
          ],
        }

        console.log("Sending simple transaction:", transaction)

        // Add timeout for transaction
        const timeoutId = setTimeout(() => {
          if (operationRef.current) {
            operationRef.current.abort()
          }
        }, 60000) // 60 second timeout

        let result
        try {
          result = await tonConnectUI.sendTransaction(transaction)
          clearTimeout(timeoutId)
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }

        if (result && mountedRef.current) {
          console.log("Transaction successful:", result)

          // Update balance locally
          const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
          const newBalance = currentBalance + amount
          localStorage.setItem("userBalance", newBalance.toString())

          playSound("deposit")
          hapticFeedback("heavy")
          showAlert(`✅ Payment successful! ${amount} TON sent to PepeCase.`)

          return result
        } else if (!mountedRef.current) {
          throw new Error("Component unmounted during transaction")
        } else {
          throw new Error("Transaction failed - no result returned")
        }
      } catch (error) {
        console.error("TON payment failed:", error)

        if (!mountedRef.current) {
          return // Don't show errors if component is unmounted
        }

        playSound("error")
        hapticFeedback("heavy")

        if (error instanceof Error) {
          if (error.message.includes("rejected") || error.message.includes("cancelled")) {
            showAlert("❌ Payment was cancelled by user.")
            safeSetState(() => setError("Payment cancelled"))
          } else if (error.message.includes("aborted") || error.message.includes("Operation aborted")) {
            showAlert("❌ Payment was cancelled.")
            safeSetState(() => setError("Payment cancelled"))
          } else if (error.message.includes("insufficient")) {
            showAlert("❌ Insufficient balance in wallet.")
            safeSetState(() => setError("Insufficient balance"))
          } else {
            showAlert(`❌ Payment failed: ${error.message}`)
            safeSetState(() => setError(error.message))
          }
        } else {
          showAlert("❌ Payment failed. Please try again.")
          safeSetState(() => setError("Payment failed"))
        }

        throw error
      } finally {
        safeSetState(() => setIsProcessing(false))
        operationRef.current = null
      }
    },
    [isConnected, walletAddress, tonConnectUI, playSound, hapticFeedback, showAlert, isProcessing, safeSetState],
  )

  // Keep the simple payment method as an alias for backward compatibility
  const sendSimpleTonPayment = sendTonPayment

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }, [])

  // Cancel any ongoing operations when wallet disconnects
  useEffect(() => {
    if (!isConnected && operationRef.current) {
      operationRef.current.abort()
      operationRef.current = null
      safeSetState(() => {
        setIsProcessing(false)
        setError(null)
      })
    }
  }, [isConnected, safeSetState])

  return {
    // Connection state
    isConnected,
    wallet,
    walletAddress,

    // Actions
    connectWallet,
    disconnectWallet,
    sendTonPayment,
    sendSimpleTonPayment, // Same as sendTonPayment now

    // Status
    isProcessing,
    error,

    // Utils
    formatAddress,
    tonConnectUI,
  }
}
