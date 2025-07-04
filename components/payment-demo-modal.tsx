"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TonLogo } from "@/components/ton-logo"
import { useSound } from "@/hooks/use-sound"

interface PaymentDemoModalProps {
  amount: number
  method: "ton" | "stars"
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentDemoModal({ amount, method, onSuccess, onCancel }: PaymentDemoModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm")
  const { playSound } = useSound()

  const handleConfirm = async () => {
    setIsProcessing(true)
    setStep("processing")
    playSound("click")

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update balance
    const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
    const newBalance = currentBalance + amount
    localStorage.setItem("userBalance", newBalance.toString())

    setStep("success")
    playSound("deposit")

    // Auto close after success
    setTimeout(() => {
      onSuccess()
    }, 2000)
  }

  if (step === "processing") {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-6xl">⭐</div>
          <h3 className="text-white font-bold text-lg mb-2">Processing Stars Payment</h3>
          <p className="text-gray-400 text-sm">Paying {Math.floor(amount * 100)} Telegram Stars...</p>
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center text-2xl">
            ✅
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Payment Successful!</h3>
          <p className="text-gray-400 text-sm mb-4">{amount} TON has been added to your balance</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-400 font-bold text-xl">{amount}</span>
            <TonLogo size={20} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 text-6xl">⭐</div>
          <h3 className="text-white font-bold text-lg mb-2">Confirm Stars Payment</h3>
          <p className="text-gray-400 text-sm mb-4">
            Pay {Math.floor(amount * 100)} Telegram Stars for {amount} TON
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-yellow-400 font-bold text-2xl">{amount}</span>
            <TonLogo size={20} />
          </div>
          <p className="text-gray-500 text-xs">This is a simplified payment without webhooks</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg"
          >
            Pay {Math.floor(amount * 100)} Stars ⭐
          </Button>

          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isProcessing}
            className="w-full border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800 bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
