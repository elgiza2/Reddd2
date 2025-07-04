"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TonLogo } from "@/components/ton-logo"
import { UserProfile } from "@/components/user-profile"
import { LiveWins } from "@/components/live-wins"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useSound } from "@/hooks/use-sound"
import { boxes } from "@/data/boxes"
import { Gift, Lock } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const [userBalance, setUserBalance] = useState(0)
  const [totalDeposited, setTotalDeposited] = useState(0)
  const router = useRouter()
  const { playSound } = useSound()

  useEffect(() => {
    // Load user balance and total deposited
    const savedBalance = localStorage.getItem("userBalance")
    const savedDeposited = localStorage.getItem("totalDeposited")
    if (savedBalance) {
      setUserBalance(Number.parseFloat(savedBalance))
    }
    if (savedDeposited) {
      setTotalDeposited(Number.parseFloat(savedDeposited))
    }
  }, [])

  const handleCaseClick = (caseId: string) => {
    playSound("click")
    router.push(`/case/${caseId}`)
  }

  const canOpenFreeBox = (box: any) => {
    if (box.type === "free" && box.requiredDeposit) {
      return totalDeposited >= box.requiredDeposit
    }
    return box.type === "free"
  }

  // Separate free and paid boxes
  const freeBoxes = boxes.filter((box) => box.type === "free")
  const paidBoxes = boxes.filter((box) => box.type === "paid")

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* User Profile */}
      <UserProfile balance={userBalance} />

      {/* Live Wins */}
      <LiveWins />

      {/* Free Bonus Boxes */}
      {freeBoxes.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-400" />
            Bonus Boxes
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {freeBoxes.map((box) => {
              const isUnlocked = canOpenFreeBox(box)
              return (
                <button
                  key={box.id}
                  onClick={() => isUnlocked && handleCaseClick(box.id)}
                  disabled={!isUnlocked}
                  className={`relative p-3 rounded-xl transition-all duration-300 ${
                    isUnlocked ? "hover:scale-105 active:scale-95 cursor-pointer" : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="relative">
                    {/* Lock overlay for locked boxes */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-gray-400 text-xs">Deposit {box.requiredDeposit} TON</p>
                        </div>
                      </div>
                    )}

                    <div className="w-full h-24 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={box.image || "/placeholder.svg"}
                        alt={box.name}
                        width={120}
                        height={96}
                        className="w-full h-full object-contain"
                        style={{
                          filter: isUnlocked
                            ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))"
                            : "drop-shadow(0 0 4px rgba(255,255,255,0.1))",
                        }}
                      />
                    </div>

                    <h3 className="text-white font-medium text-sm mb-2">{box.name}</h3>

                    <div className="flex items-center justify-center gap-1">
                      {isUnlocked ? (
                        <>
                          <span className="text-green-400 font-bold text-sm">FREE</span>
                          <Gift className="w-4 h-4 text-green-400" />
                        </>
                      ) : (
                        <>
                          <span className="text-gray-400 font-bold text-sm">LOCKED</span>
                          <Lock className="w-4 h-4 text-gray-400" />
                        </>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Regular Cases */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Cases</h2>
        <div className="grid grid-cols-2 gap-3">
          {paidBoxes.map((box) => (
            <button
              key={box.id}
              onClick={() => handleCaseClick(box.id)}
              className="relative p-3 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <div className="w-full h-24 mb-3 rounded-lg overflow-hidden">
                <Image
                  src={box.image || "/placeholder.svg"}
                  alt={box.name}
                  width={120}
                  height={96}
                  className="w-full h-full object-contain"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.1))" }}
                />
              </div>

              <h3 className="text-white font-medium text-sm mb-2">{box.name}</h3>

              <div className="flex items-center justify-center gap-1">
                <span className="text-yellow-400 font-bold text-sm">{box.price}</span>
                <TonLogo size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
