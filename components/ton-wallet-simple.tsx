"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TonLogo } from "@/components/ton-logo"
import { useSound } from "@/hooks/use-sound"
import { Copy, ExternalLink } from "lucide-react"

const PEPECASE_WALLET = "UQDpWr5-kwW8BF2bsqi7v82gjDoR6E71wvf0vGVWKUMSvV0Q"

interface TonWalletSimpleProps {
  amount: number
  onPaymentComplete?: () => void
}

export function TonWalletSimple({ amount, onPaymentComplete }: TonWalletSimpleProps) {
  const [copied, setCopied] = useState(false)
  const { playSound } = useSound()

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(PEPECASE_WALLET)
      setCopied(true)
      playSound("click")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const openTonkeeper = () => {
    playSound("click")
    const tonkeeperUrl = `https://app.tonkeeper.com/transfer/${PEPECASE_WALLET}?amount=${amount * 1000000000}&text=PepeCase%20Deposit`
    window.open(tonkeeperUrl, "_blank")
  }

  const openTonWallet = () => {
    playSound("click")
    const tonWalletUrl = `https://wallet.ton.org/transfer/${PEPECASE_WALLET}?amount=${amount * 1000000000}&text=PepeCase%20Deposit`
    window.open(tonWalletUrl, "_blank")
  }

  const confirmPayment = () => {
    playSound("deposit")

    // Update balance
    const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
    const newBalance = currentBalance + amount
    localStorage.setItem("userBalance", newBalance.toString())

    alert(`✅ Payment confirmed! ${amount} TON added to your balance.`)
    onPaymentComplete?.()
  }

  return (
    <div className="space-y-6">
      {/* TON Logo */}
      <div className="flex justify-center">
        <div className="w-24 h-24 flex items-center justify-center">
          <TonLogo size={96} />
        </div>
      </div>

      {/* Payment Amount */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl font-bold text-white">{amount}</span>
          <TonLogo size={24} />
        </div>
        <p className="text-gray-400 text-sm">Amount to send</p>
      </div>

      {/* Wallet Address */}
      <div className="bg-gray-900 rounded-lg p-4">
        <label className="text-gray-400 text-sm mb-2 block">Send to PepeCase Wallet:</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-800 rounded p-3">
            <p className="text-white text-xs font-mono break-all">{PEPECASE_WALLET}</p>
          </div>
          <Button
            onClick={copyAddress}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
          >
            {copied ? "✓" : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Wallet Options */}
      <div className="space-y-3">
        <h3 className="text-white font-medium text-center">Choose your wallet:</h3>

        <Button
          onClick={openTonkeeper}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <span>📱</span>
          Open in Tonkeeper
          <ExternalLink className="w-4 h-4" />
        </Button>

        <Button
          onClick={openTonWallet}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <span>💼</span>
          Open in TON Wallet
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2">📋 Instructions:</h4>
        <ol className="text-blue-300 text-sm space-y-1">
          <li>1. Click on your preferred wallet above</li>
          <li>2. Confirm the transaction in your wallet</li>
          <li>3. Wait for confirmation (1-2 minutes)</li>
          <li>4. Click "I've Sent Payment" below</li>
        </ol>
      </div>

      {/* Confirm Payment Button */}
      <Button
        onClick={confirmPayment}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg"
      >
        ✅ I've Sent Payment
      </Button>

      {/* Manual Copy Option */}
      <div className="text-center">
        <p className="text-gray-500 text-xs">Or copy the address manually and send from any TON wallet</p>
      </div>
    </div>
  )
}
