"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import { UserProfile } from "@/components/user-profile"
import { useTelegram } from "@/hooks/use-telegram"
import { useSound } from "@/hooks/use-sound"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function LeaderboardPage() {
  const [userBalance, setUserBalance] = useState(0)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userBalance")
      setUserBalance(saved ? Number.parseFloat(saved) : 0)
    }
  }, [])
  const router = useRouter()
  const { playSound } = useSound()
  const { hapticFeedback, user } = useTelegram()

  const handleBack = () => {
    playSound("click")
    hapticFeedback("light")
    router.back()
  }

  const userCases = 0 // Real data would come from your database
  const userRank = 0 // Real data would come from your database

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
        <h1 className="text-base font-bold text-white">Leaderboard</h1>
        <div className="w-16"></div>
      </div>

      <UserProfile balance={userBalance} />

      <div className="px-3 py-4">
        <div className="p-4 mb-4 relative">
          <div className="absolute top-3 right-3">
            <span className="text-gray-400 font-bold text-sm">#{userRank || "N/A"}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
              {user && (
                <Image
                  src={user.photo_url || `/placeholder.svg?height=48&width=48&text=${user.first_name[0]}`}
                  alt={user.first_name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.1))" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=48&width=48&text=${user.first_name[0]}`
                  }}
                />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">{user?.first_name || "User"}</h3>
              <p className="text-lg font-bold text-white">{userCases} Cases</p>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4">Leaders</h2>

        <div className="text-center py-12">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-gray-400 text-center text-sm">No leaderboard data yet</p>
          <p className="text-gray-500 text-xs text-center mt-1">Start opening cases to see rankings!</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
