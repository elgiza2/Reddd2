"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import { UserProfile } from "@/components/user-profile"
import { TonLogo } from "@/components/ton-logo"
import { useSound } from "@/hooks/use-sound"
import { useTelegram } from "@/hooks/use-telegram"
import { ArrowLeft, Copy, Users } from "lucide-react"
import Image from "next/image"

interface UserStats {
  friendsCount: number
  totalEarnings: number
  level1Count: number
  level2Count: number
  level3Count: number
}

interface Referral {
  userId: number
  referrerUsername: string
  createdAt: string
  level: number
  photo_url?: string
}

export default function FriendsPage() {
  const [userBalance, setUserBalance] = useState(0)
  const [userStats, setUserStats] = useState<UserStats>({
    friendsCount: 0,
    totalEarnings: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
  })
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { playSound } = useSound()
  const { hapticFeedback, showAlert, user, getUserPhoto } = useTelegram()

  // Load balance and user stats
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userBalance")
      setUserBalance(saved ? Number.parseFloat(saved) : 0)
    }

    if (user) {
      loadUserStats()
      saveUserData()
    }
  }, [user])

  const saveUserData = async () => {
    if (!user) return

    try {
      await fetch("/api/telegram/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
    } catch (error) {
      console.error("Error saving user data:", error)
    }
  }

  const loadUserStats = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/telegram/user-stats/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserStats(data.stats)

        // Load photos for referrals
        const referralsWithPhotos = await Promise.all(
          data.referrals.map(async (referral: Referral) => {
            const photoUrl = await getUserPhoto(referral.userId)
            return {
              ...referral,
              photo_url: photoUrl,
            }
          }),
        )

        setReferrals(referralsWithPhotos)
      }
    } catch (error) {
      console.error("Error loading user stats:", error)
    } finally {
      setLoading(false)
    }
  }

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
        showAlert("تم نسخ رابط الدعوة!")
      })
    } else {
      showAlert(`شارك هذا الرابط: ${inviteLink}`)
    }
  }

  const handleWithdraw = () => {
    playSound("click")
    hapticFeedback("medium")
    showAlert("ميزة السحب قريباً!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    )
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
          رجوع
        </Button>
        <h1 className="text-base font-bold text-white">الأصدقاء</h1>
        <div className="w-16"></div>
      </div>

      <UserProfile balance={userBalance} showDeposit={false} />

      <div className="px-3">
        <Button
          onClick={handleInvite}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg mb-4 text-sm backdrop-blur-sm w-full flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          دعوة صديق
        </Button>
      </div>

      <div className="px-3 py-4">
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              i
            </div>
            <h3 className="text-base font-bold">نظام الإحالة 3 مستويات</h3>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">المستوى 1 - 10%</span>
            <span className="text-gray-400">→</span>
            <span className="text-gray-400">المستوى 2 - 5%</span>
            <span className="text-gray-400">→</span>
            <span className="text-gray-400">المستوى 3 - 2.5%</span>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-gray-400 mb-1 text-sm">رصيد الإحالة</h4>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{userStats.totalEarnings.toFixed(2)}</span>
                <TonLogo size={16} />
              </div>
            </div>
            <Button
              onClick={handleWithdraw}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg text-sm backdrop-blur-sm"
              disabled={userStats.totalEarnings === 0}
            >
              سحب
            </Button>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <p className="text-gray-300 text-xs leading-relaxed">
            هل لديك قناة تليجرام وتريد نشر أكواد الخصم الحصرية لجمهورك؟{" "}
            <span className="text-yellow-400 font-bold">تواصل مع @Justceof!</span>
          </p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold">الأصدقاء</h3>
            <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold">
              {userStats.friendsCount}
            </span>
          </div>

          {userStats.friendsCount === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">👥</div>
              <p className="text-gray-400 text-sm">لا يوجد أصدقاء بعد</p>
              <p className="text-gray-500 text-xs mt-1">ادع أصدقاءك لكسب مكافآت الإحالة!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-lg font-bold text-yellow-400">{userStats.level1Count}</div>
                  <div className="text-xs text-gray-400">المستوى 1</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-lg font-bold text-yellow-400">{userStats.level2Count}</div>
                  <div className="text-xs text-gray-400">المستوى 2</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-lg font-bold text-yellow-400">{userStats.level3Count}</div>
                  <div className="text-xs text-gray-400">المستوى 3</div>
                </div>
              </div>

              {referrals.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-bold mb-2">آخر الإحالات:</h4>
                  <div className="space-y-2">
                    {referrals.slice(0, 5).map((referral, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                            {referral.photo_url ? (
                              <Image
                                src={referral.photo_url || "/placeholder.svg"}
                                alt={referral.referrerUsername}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">${referral.referrerUsername[0]?.toUpperCase() || "U"}</div>`
                                  }
                                }}
                              />
                            ) : (
                              <div className="text-gray-400 text-xs font-bold">
                                {referral.referrerUsername[0]?.toUpperCase() || "U"}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium">@{referral.referrerUsername}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(referral.createdAt).toLocaleDateString("ar")}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                          المستوى {referral.level}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
