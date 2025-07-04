"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TonLogo } from "@/components/ton-logo"
import { Input } from "@/components/ui/input"
import { TonConnectProvider } from "@/components/ton-connect-provider"
import { TonWalletConnect } from "@/components/ton-wallet-connect"
import { useTonConnect } from "@/hooks/use-ton-connect"
import { useSound } from "@/hooks/use-sound"
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"

function DepositPageContent() {
  const [amount, setAmount] = useState("1")
  const [promoCode, setPromoCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const router = useRouter()
  const { playSound } = useSound()
  const { sendTonPayment, isConnected, isProcessing: tonProcessing } = useTonConnect()

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
        setErrorMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, errorMessage])

  const handleBack = () => {
    playSound("click")
    router.back()
  }

  const validateAmount = () => {
    const numAmount = Number.parseFloat(amount)
    if (!amount || numAmount <= 0) {
      setErrorMessage("Please enter a valid amount")
      return false
    }
    if (numAmount < 0.1) {
      setErrorMessage("Minimum deposit is 0.1 TON")
      return false
    }
    if (numAmount > 1000) {
      setErrorMessage("Maximum deposit is 1000 TON")
      return false
    }
    return true
  }

  const handleTonDeposit = async () => {
    if (!validateAmount()) return

    setIsProcessing(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      if (!isConnected) {
        setErrorMessage("Please connect your TON wallet first")
        return
      }

      const amountNum = Number.parseFloat(amount)
      await sendTonPayment(amountNum, "PepeCase Deposit")
      setSuccessMessage(`Successfully deposited ${amount} TON to your account!`)

      // Update total deposited
      const currentDeposited = Number.parseFloat(localStorage.getItem("totalDeposited") || "0")
      const newTotalDeposited = currentDeposited + amountNum
      localStorage.setItem("totalDeposited", newTotalDeposited.toString())

      // Auto-redirect after success
      setTimeout(() => {
        router.back()
      }, 2000)
    } catch (error) {
      console.error("TON payment failed:", error)
      if (error instanceof Error && !error.message.includes("cancelled")) {
        setErrorMessage(error.message)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 relative z-10">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 transition-all duration-300"
          disabled={isProcessing || tonProcessing}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-base font-bold text-white">TON Deposit</h1>
        <div className="w-16"></div>
      </div>

      <div className="px-3 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">TON Connect Payment</h1>

        {/* Status Messages */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{errorMessage}</span>
          </div>
        )}

        {/* TON Wallet Connection */}
        <div className="mb-6">
          <TonWalletConnect showBalance={true} />
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Amount (TON)</label>
          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white text-xl font-bold py-3 pr-10"
              placeholder="1"
              min="0.1"
              max="1000"
              step="0.1"
              disabled={isProcessing || tonProcessing}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <TonLogo size={20} />
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-1">Min: 0.1 TON • Max: 1000 TON</p>
        </div>

        {/* Promo Code */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Promo code (optional)</label>
          <Input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
            placeholder="Enter promo code"
            disabled={isProcessing || tonProcessing}
          />
        </div>

        {/* Payment Button */}
        <Button
          onClick={handleTonDeposit}
          disabled={isProcessing || tonProcessing || !isConnected}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-lg backdrop-blur-sm"
        >
          {isProcessing || tonProcessing
            ? "Processing Payment..."
            : !isConnected
              ? "Connect Wallet First"
              : `Pay ${amount} TON`}
        </Button>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
            <TonLogo size={16} />
            TON Connect Payment
          </h4>
          <ul className="text-blue-300 text-sm space-y-1">
            <li>• Connect your TON wallet securely</li>
            <li>• Fast and reliable transactions</li>
            <li>• Funds added instantly to your balance</li>
            <li>• Minimum deposit: 0.1 TON</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function DepositPage() {
  return (
    <TonConnectProvider>
      <DepositPageContent />
    </TonConnectProvider>
  )
}
