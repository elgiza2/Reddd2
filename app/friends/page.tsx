"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import { UserProfile } from "@/components/user-profile"
import { TonLogo } from "@/components/ton-logo"
import { useSound } from "@/hooks/use-sound"
import { useTelegram } from "@/hooks/use-telegram"
import { ArrowLeft } from "lucide-react"

export default function FriendsPage() {
  const [userBalance, setUserBalance] = useState(0)

  // read balance on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userBalance")
      setUserBalance(saved ? Number.parseFloat(saved) : 0)
    }
  }, [])
  const router = useRouter()
  const { playSound } = useSound()
  const { hapticFeedback, showAlert, user } = useTelegram()

  const handleBack = () => {
    playSound("click")
    hapticFeedback("light")
    router.back()
  }

  const handleInvite = () => {
    playSound("click")
    hapticFeedback("medium")

    const username = user?.username || user?.id || "user"
    const inviteLink = `https://t.me/Spaceklbot?startapp=${username}`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        showAlert("Invite link copied to clipboard!")
      })
    } else {
      showAlert(`Share this link: ${inviteLink}`)
    }
  }

  const handleWithdraw = () => {
    playSound("click")
    hapticFeedback("medium")
    showAlert("Withdrawal feature coming soon!")
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <div className="flex items-center justify-between p-3 relative z-10">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-base font-bold text-white">Friends</h1>
        <div className="w-16"></div>
      </div>

      <UserProfile balance={userBalance} showDeposit={false} />

      <div className="px-3">
        <Button
          onClick={handleInvite}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg mb-4 text-sm backdrop-blur-sm"
        >
          Invite Friend
        </Button>
      </div>

      <div className="px-3 py-4">
        <div className="p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              i
            </div>
            <h3 className="text-base font-bold">3 Level Referral System</h3>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">1 LVL - 10%</span>
            <span className="text-gray-400">→</span>
            <span className="text-gray-400">2 LVL - 5%</span>
            <span className="text-gray-400">→</span>
            <span className="text-gray-400">3 LVL - 2.5%</span>
          </div>
        </div>

        <div className="p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-gray-400 mb-1 text-sm">Referral Balance</h4>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">0.00</span>
                <TonLogo size={16} />
              </div>
            </div>
            <Button
              onClick={handleWithdraw}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg text-sm backdrop-blur-sm"
              disabled
            >
              Withdraw
            </Button>
          </div>
        </div>

        <div className="p-4 mb-4">
          <p className="text-gray-300 text-xs leading-relaxed">
            Do you have a Telegram channel and want to publish our exclusive promo codes specifically for your audience?{" "}
            <span className="text-yellow-400 font-bold">Contact @Justceof!</span>
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-bold">Friends</h3>
            <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold">0</span>
          </div>

          <div className="text-center py-6">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-gray-400 text-sm">No friends yet</p>
            <p className="text-gray-500 text-xs mt-1">Invite friends to earn referral bonuses!</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
