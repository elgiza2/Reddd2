"use client"

import { useState } from "react"
import { UserProfileLarge } from "@/components/user-profile-large"
import { BottomNavigation } from "@/components/bottom-navigation"
import { TonWalletConnect } from "@/components/ton-wallet-connect"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Gift } from "lucide-react"

export default function ProfilePage() {
  const [balance] = useState(125.5)

  const achievements = [
    { id: 1, name: "First Win", icon: Trophy, earned: true },
    { id: 2, name: "Lucky Streak", icon: Star, earned: true },
    { id: 3, name: "Big Winner", icon: Gift, earned: false },
  ]

  const stats = [
    { label: "Total Wins", value: "23" },
    { label: "Best Streak", value: "7" },
    { label: "Cases Opened", value: "156" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <UserProfileLarge balance={balance} showButtons={false} />

        <div className="space-y-6">
          {/* TON Wallet Connection */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">TON Wallet</h3>
              <TonWalletConnect />
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-green-400">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <achievement.icon
                        className={`w-6 h-6 ${achievement.earned ? "text-yellow-400" : "text-gray-500"}`}
                      />
                      <span className={achievement.earned ? "text-white" : "text-gray-500"}>{achievement.name}</span>
                    </div>
                    <Badge variant={achievement.earned ? "default" : "secondary"}>
                      {achievement.earned ? "Earned" : "Locked"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
