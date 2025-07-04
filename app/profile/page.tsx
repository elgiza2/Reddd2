"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import { UserProfileLarge } from "@/components/user-profile-large"
import { TonLogo } from "@/components/ton-logo"
import { TonConnectProvider } from "@/components/ton-connect-provider"
import { TonConnectButton } from "@/components/ton-connect-button"
import { useInventory } from "@/hooks/use-inventory"
import { useTelegram } from "@/hooks/use-telegram"
import { useSound } from "@/hooks/use-sound"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

function ProfilePageContent() {
  const [activeTab, setActiveTab] = useState("Available")
  const [userBalance, setUserBalance] = useState(0)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userBalance")
      setUserBalance(saved ? Number.parseFloat(saved) : 0)
    }
  }, [])
  const router = useRouter()
  const { playSound } = useSound()
  const { hapticFeedback } = useTelegram()
  const { inventory, sellItem, withdrawItem } = useInventory()

  const handleBack = () => {
    playSound("click")
    hapticFeedback("light")
    router.back()
  }

  const handleSellItem = (itemId: string) => {
    playSound("deposit")
    sellItem(itemId)
    // Refresh balance display
    window.location.reload()
  }

  const handleWithdrawItem = (itemId: string) => {
    playSound("click")
    withdrawItem(itemId)
  }

  const tabs = ["Available", "Withdrawn", "Sold"]
  const currentItems = inventory[activeTab.toLowerCase() as keyof typeof inventory]

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
        <h1 className="text-base font-bold text-white">Profile</h1>
        <div className="w-16"></div>
      </div>

      <UserProfileLarge balance={userBalance} showButtons={false} />

      {/* Wallet Connection */}
      <div className="px-3 mb-6">
        <h3 className="text-lg font-bold mb-3">TON Wallet</h3>
        <TonConnectButton className="w-full" />
      </div>

      <div className="px-3">
        <h3 className="text-lg font-bold mb-4">Inventory</h3>

        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                playSound("click")
                hapticFeedback("selection")
                setActiveTab(tab)
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm backdrop-blur-sm ${
                activeTab === tab ? "bg-yellow-400 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab} ({currentItems.length})
            </button>
          ))}
        </div>

        {currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-400 text-center text-sm">
              {activeTab === "Available"
                ? "No items in your inventory yet"
                : activeTab === "Withdrawn"
                  ? "No withdrawn items"
                  : "No sold items"}
            </p>
            <p className="text-gray-500 text-xs text-center mt-1">
              {activeTab === "Available" ? "Open some cases to get started!" : ""}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {currentItems.map((item) => (
              <div key={item.id} className="p-3 backdrop-blur-sm rounded-lg">
                <div className="w-full h-24 mb-3 flex items-center justify-center">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-contain rounded"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.1))" }}
                  />
                </div>

                <h4 className="text-white font-medium text-sm mb-1 truncate">{item.name}</h4>
                <p className="text-gray-400 text-xs mb-2">From: {item.caseName}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 font-bold text-sm">{item.value}</span>
                    <TonLogo size={10} />
                  </div>
                  <span className="text-gray-500 text-xs">{new Date(item.dateWon).toLocaleDateString()}</span>
                </div>

                {activeTab === "Available" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSellItem(item.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1"
                    >
                      Sell
                    </Button>
                    <Button
                      onClick={() => handleWithdrawItem(item.id)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1"
                    >
                      Withdraw
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <TonConnectProvider>
      <ProfilePageContent />
    </TonConnectProvider>
  )
}
