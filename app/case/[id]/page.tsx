"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TonLogo } from "@/components/ton-logo"
import { PrizeActionModal } from "@/components/prize-action-modal"
import { useSound } from "@/hooks/use-sound"
import { useTelegram } from "@/hooks/use-telegram"
import { boxes } from "@/data/boxes"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function CaseOpeningPage() {
  const params = useParams()
  const router = useRouter()
  const caseId = params.id as string
  const { playSound, stopSound } = useSound()
  const { hapticFeedback, showAlert } = useTelegram()

  const [isOpening, setIsOpening] = useState(false)
  const [wonPrize, setWonPrize] = useState<any>(null)
  const [showPrizeModal, setShowPrizeModal] = useState(false)
  const [animationItems, setAnimationItems] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mode, setMode] = useState<"Real" | "Demo">("Real")
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "shaking" | "opening" | "spinning" | "revealing" | "complete"
  >("idle")
  const [userBalance, setUserBalance] = useState(0)
  const [totalDeposited, setTotalDeposited] = useState(0)

  const box = boxes.find((b) => b.id === caseId)

  useEffect(() => {
    if (!box) {
      router.push("/")
    }
    // Load user balance and total deposited
    const savedBalance = localStorage.getItem("userBalance")
    const savedDeposited = localStorage.getItem("totalDeposited")
    if (savedBalance) {
      setUserBalance(Number.parseFloat(savedBalance))
    }
    if (savedDeposited) {
      setTotalDeposited(Number.parseFloat(savedDeposited))
    }
  }, [box, router])

  const handleBack = () => {
    playSound("click")
    hapticFeedback("light")
    router.back()
  }

  const canOpenFreeBox = () => {
    if (box?.type === "free" && box.requiredDeposit) {
      return totalDeposited >= box.requiredDeposit
    }
    return box?.type === "free"
  }

  const handleOpenCase = async () => {
    if (isOpening) return

    // Check if it's a free box with deposit requirement
    if (box?.type === "free" && box.requiredDeposit && !canOpenFreeBox()) {
      showAlert(`You need to deposit at least ${box.requiredDeposit} TON to unlock this bonus box.`)
      router.push("/deposit")
      return
    }

    // Check balance only for Real mode and paid boxes
    if (mode === "Real" && box?.type === "paid" && userBalance < (box?.price || 0)) {
      showAlert("Insufficient balance to open this case. Please deposit more funds.")
      router.push("/deposit")
      return
    }

    playSound("click")
    hapticFeedback("medium")
    setIsOpening(true)

    // Deduct balance only for Real mode and paid boxes
    if (mode === "Real" && box?.type === "paid") {
      const newBalance = userBalance - (box?.price || 0)
      setUserBalance(newBalance)
      localStorage.setItem("userBalance", newBalance.toString())
    }

    // Start opening animation
    setAnimationPhase("shaking")
    playSound("boxOpen")

    // Phase 1: Case shaking
    let shakeCount = 0
    const shakeInterval = setInterval(() => {
      hapticFeedback("light")
      shakeCount++

      if (shakeCount >= 6) {
        clearInterval(shakeInterval)

        setTimeout(() => {
          setAnimationPhase("spinning")
          startSpinning()
        }, 300)
      }
    }, 100)
  }

  const startSpinning = () => {
    if (!box?.rewards || box.rewards.length === 0) {
      console.error("No rewards found for this box")
      setIsOpening(false)
      setAnimationPhase("idle")
      return
    }

    playSound("spinning", { loop: true })

    // Create animation items with proper rewards
    const rewards = box.rewards
    const shuffled = [...rewards].sort(() => Math.random() - 0.5)
    const extended = []

    // Create enough items for smooth animation (ensure we have valid rewards)
    for (let i = 0; i < 50; i++) {
      const reward = shuffled[i % shuffled.length]
      if (reward && reward.image) {
        extended.push(reward)
      }
    }

    // Fallback if no valid rewards
    if (extended.length === 0) {
      console.error("No valid rewards with images found")
      setIsOpening(false)
      setAnimationPhase("idle")
      stopSound("spinning")
      return
    }

    setAnimationItems(extended)
    setCurrentIndex(0)

    let speed = 50
    let currentIdx = 0
    const totalItems = extended.length
    const targetIndex = totalItems - 8 // Stop near the end

    const animate = () => {
      currentIdx++
      setCurrentIndex(currentIdx)

      // Slow down near the end
      if (currentIdx > totalItems - 20) {
        speed += Math.pow((currentIdx - (totalItems - 20)) / 20, 2) * 50
      }

      if (currentIdx % 3 === 0) {
        hapticFeedback("light")
      }

      if (currentIdx >= targetIndex) {
        stopSound("spinning")
        setAnimationPhase("revealing")

        // Select final prize based on mode
        let finalPrize
        if (mode === "Demo") {
          // In Demo mode, always win high-value prizes (not TON)
          const nonTonPrizes = rewards.filter((reward) => !reward.name.includes("Ton Balance"))
          const highValuePrizes = nonTonPrizes.filter((reward) => reward.value >= 100)
          finalPrize =
            highValuePrizes.length > 0
              ? highValuePrizes[Math.floor(Math.random() * highValuePrizes.length)]
              : nonTonPrizes[0] || rewards[0]
        } else {
          // In Real mode, always win TON Balance
          const tonPrizes = rewards.filter((reward) => reward.name.includes("Ton Balance"))
          if (tonPrizes.length > 0) {
            finalPrize = tonPrizes[Math.floor(Math.random() * tonPrizes.length)]
          } else {
            // Fallback if no TON prizes
            finalPrize = rewards[Math.floor(Math.random() * rewards.length)]
          }
        }

        setTimeout(() => {
          setWonPrize(finalPrize)
          setAnimationPhase("complete")
          setIsOpening(false)

          if (finalPrize?.value >= 100) {
            playSound("bigWin")
            hapticFeedback("heavy")
          } else {
            playSound("win")
            hapticFeedback("medium")
          }

          // Show prize action modal directly (no intermediate screen)
          setTimeout(() => {
            setShowPrizeModal(true)
          }, 500)
        }, 1000)

        return
      }

      setTimeout(animate, speed)
    }

    animate()
  }

  const handlePrizeAction = (action: "sell" | "claim") => {
    if (action === "sell") {
      // Update balance display
      const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
      setUserBalance(currentBalance)
    }

    // Reset state and go back
    setWonPrize(null)
    setAnimationPhase("idle")
    setCurrentIndex(0)
    setAnimationItems([])
    setShowPrizeModal(false)
    handleBack()
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-3 relative z-10">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          disabled={isOpening}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-base font-bold text-white">{box?.name}</h1>
        <div className="flex items-center gap-1">
          <span className="text-white font-bold text-sm">{userBalance.toFixed(2)}</span>
          <TonLogo size={12} />
        </div>
      </div>

      <div className="px-3 py-4 relative z-10">
        {/* Free Box Status */}
        {box?.type === "free" && box.requiredDeposit && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-green-400 font-medium">🎁 Bonus Box</h4>
                <p className="text-green-300 text-sm">
                  {canOpenFreeBox() ? "Unlocked! Open for free" : `Deposit ${box.requiredDeposit} TON to unlock`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-400 text-sm">Deposited:</p>
                <p className="text-green-300 font-bold">{totalDeposited} TON</p>
              </div>
            </div>
          </div>
        )}

        {/* Mode Toggle - Only for paid boxes */}
        {box?.type === "paid" && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                if (!isOpening) {
                  playSound("click")
                  setMode("Real")
                }
              }}
              disabled={isOpening}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 backdrop-blur-sm ${
                mode === "Real" ? "bg-yellow-400/90 text-black" : "text-gray-400 hover:text-white"
              } ${isOpening ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Real
            </button>
            <button
              onClick={() => {
                if (!isOpening) {
                  playSound("click")
                  setMode("Demo")
                }
              }}
              disabled={isOpening}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 backdrop-blur-sm ${
                mode === "Demo" ? "bg-yellow-400/90 text-black" : "text-gray-400 hover:text-white"
              } ${isOpening ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Demo
            </button>
          </div>
        )}

        {/* Case Opening Animation */}
        {animationPhase === "spinning" || animationPhase === "revealing" ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-6 animate-pulse">
              {animationPhase === "spinning" ? "Opening Case..." : "Revealing Prize..."}
            </h2>

            <div className="relative mb-6 overflow-hidden">
              <div className="flex items-center justify-center h-32 relative bg-gray-900/30 rounded-xl p-4">
                {animationItems.length > 0 && (
                  <div
                    className="flex gap-4 transition-transform ease-linear"
                    style={{
                      transform: `translateX(-${currentIndex * 88}px)`,
                      transitionDuration: animationPhase === "spinning" ? "0.1s" : "0.5s",
                    }}
                  >
                    {animationItems.map((item, index) => (
                      <div
                        key={`${index}-${item.name}`}
                        className="flex-shrink-0 w-20 h-20 bg-gray-800/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-gray-600/30"
                      >
                        {item.image && (
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded object-contain"
                            style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.1))" }}
                            onError={(e) => {
                              console.error("Image failed to load:", item.image)
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Selection indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 border-2 border-yellow-400 rounded-lg animate-pulse shadow-xl shadow-yellow-400/50">
                    <div className="w-full h-full border border-white/30 rounded animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Rewards Preview - Top Section */}
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {(box?.rewards || []).slice(0, 6).map((reward, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-16 h-20 p-2 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 mb-1">
                      <Image
                        src={reward.image || "/placeholder.svg"}
                        alt={reward.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain rounded"
                        style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.1))" }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xs font-bold">{reward.value}</span>
                      <TonLogo size={6} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Button */}
            <div className="text-center mb-4">
              <Button
                onClick={handleOpenCase}
                disabled={isOpening || (box?.type === "free" && box.requiredDeposit && !canOpenFreeBox())}
                className={`bg-yellow-400/90 hover:bg-yellow-500/90 text-black font-bold px-8 py-3 rounded-lg text-base relative overflow-hidden group transition-all duration-300 backdrop-blur-sm ${
                  isOpening ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                }`}
              >
                <span className="relative z-10">
                  {box?.type === "free" && box.requiredDeposit && !canOpenFreeBox()
                    ? `Deposit ${box.requiredDeposit} TON to Unlock`
                    : box?.type === "free"
                      ? "Open Free Box"
                      : mode === "Real" && userBalance < (box?.price || 0)
                        ? `Deposit ${box?.price} TON`
                        : animationPhase === "idle"
                          ? mode === "Demo"
                            ? `Try Case`
                            : box?.type === "paid"
                              ? `Open Case (${box?.price} TON)`
                              : "Open Case"
                          : "Opening..."}
                </span>
              </Button>
            </div>

            {/* All Rewards - Two Columns */}
            <div>
              <h3 className="text-base font-bold text-white text-center mb-3">All Rewards</h3>
              <div className="grid grid-cols-2 gap-2">
                {(box?.rewards || []).map((reward, index) => (
                  <div
                    key={index}
                    className="p-2 flex flex-col items-center text-center hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 mb-2">
                      <Image
                        src={reward.image || "/placeholder.svg"}
                        alt={reward.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain rounded"
                        style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.1))" }}
                      />
                    </div>
                    <p className="text-white text-xs font-medium mb-1 truncate w-full">{reward.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm font-bold">{reward.value}</span>
                      <TonLogo size={8} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Prize Action Modal - Only one modal */}
      {showPrizeModal && wonPrize && (
        <PrizeActionModal
          prize={wonPrize}
          caseId={caseId}
          caseName={box?.name || "Unknown Case"}
          onClose={() => setShowPrizeModal(false)}
          onComplete={handlePrizeAction}
          isDemoMode={mode === "Demo"}
        />
      )}
    </div>
  )
}
