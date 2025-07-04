"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TonLogo } from "@/components/ton-logo"
import { useSound } from "@/hooks/use-sound"
import { useInventory } from "@/hooks/use-inventory"
import { X } from "lucide-react"
import Image from "next/image"

interface Prize {
  name: string
  image: string
  value: number
}

interface PrizeActionModalProps {
  prize: Prize
  caseId: string
  caseName: string
  onClose: () => void
  onComplete: (action: "sell" | "claim") => void
  isDemoMode?: boolean
}

export function PrizeActionModal({
  prize,
  caseId,
  caseName,
  onClose,
  onComplete,
  isDemoMode = false,
}: PrizeActionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { playSound } = useSound()
  const { addItem } = useInventory()

  const handleSell = async () => {
    if (isDemoMode) {
      playSound("click")
      onComplete("sell")
      return
    }

    setIsProcessing(true)
    playSound("deposit")

    // Add to balance directly
    const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
    const newBalance = currentBalance + prize.value
    localStorage.setItem("userBalance", newBalance.toString())

    setTimeout(() => {
      setIsProcessing(false)
      onComplete("sell")
    }, 1000)
  }

  const handleClaim = async () => {
    if (isDemoMode) {
      playSound("click")
      onComplete("claim")
      return
    }

    setIsProcessing(true)
    playSound("win")

    // Add to inventory
    addItem(prize, caseId, caseName)

    setTimeout(() => {
      setIsProcessing(false)
      onComplete("claim")
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full border border-gray-700">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            disabled={isProcessing}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-center">
            <div className="text-blue-400 font-medium text-sm">🎮 Demo Mode</div>
            <div className="text-blue-300 text-xs mt-1">
              This is just a preview - deposit TON to play for real rewards!
            </div>
          </div>
        )}

        {/* Prize Display */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image
              src={prize.image || "/placeholder.svg"}
              alt={prize.name}
              width={80}
              height={80}
              className="w-full h-full object-contain rounded-lg"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.2))" }}
            />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">{prize.name}</h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-yellow-400 font-bold text-xl">{prize.value}</span>
            <TonLogo size={18} />
          </div>
          <p className="text-gray-400 text-sm">
            {isDemoMode ? "Demo prize preview" : "What would you like to do with your prize?"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSell}
            disabled={isProcessing}
            className={`w-full font-bold py-3 rounded-lg transition-all duration-300 ${
              isDemoMode ? "bg-gray-600 hover:bg-gray-700 text-gray-300" : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isProcessing && !isDemoMode
              ? "Selling..."
              : isDemoMode
                ? `Preview: Sell for ${prize.value} TON`
                : `Sell for ${prize.value} TON`}
          </Button>

          <Button
            onClick={handleClaim}
            disabled={isProcessing}
            className={`w-full font-bold py-3 rounded-lg transition-all duration-300 ${
              isDemoMode ? "bg-gray-600 hover:bg-gray-700 text-gray-300" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isProcessing && !isDemoMode
              ? "Claiming..."
              : isDemoMode
                ? "Preview: Claim to Inventory"
                : "Claim to Inventory"}
          </Button>
        </div>

        {isDemoMode && (
          <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
            <div className="text-yellow-400 text-sm font-medium">💰 Ready to play for real?</div>
            <div className="text-yellow-300 text-xs mt-1">Deposit TON to keep your prizes!</div>
          </div>
        )}
      </div>
    </div>
  )
}
