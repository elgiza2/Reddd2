"use client"

import { useTelegram } from "@/hooks/use-telegram"
import { TonLogo } from "@/components/ton-logo"
import { Button } from "@/components/ui/button"
import { useSound } from "@/hooks/use-sound"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User } from "lucide-react"

interface UserProfileLargeProps {
  balance: number
  showButtons?: boolean
}

export function UserProfileLarge({ balance, showButtons = true }: UserProfileLargeProps) {
  const { user, isLoading } = useTelegram()
  const { playSound } = useSound()
  const router = useRouter()

  const handleDeposit = () => {
    playSound("click")
    router.push("/deposit")
  }

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-24 h-24 bg-gray-700 rounded-full animate-pulse mb-4"></div>
        <div className="w-32 h-6 bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="w-24 h-8 bg-gray-700 rounded animate-pulse mb-6"></div>
        {showButtons && (
          <div className="flex gap-4">
            <div className="w-24 h-10 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    )
  }

  const displayName = user.first_name
  const hasPhoto = user.photo_url && user.photo_url !== ""

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-700 flex items-center justify-center">
        {hasPhoto ? (
          <Image
            src={user.photo_url! || "/placeholder.svg"}
            alt={displayName}
            width={96}
            height={96}
            className="w-full h-full object-cover"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.1))" }}
            crossOrigin="anonymous"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = "none"
              // Show fallback icon
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`
              }
            }}
          />
        ) : (
          <User className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <h2 className="text-xl font-bold mb-2">{displayName}</h2>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-3xl font-bold">{balance.toFixed(2)}</span>
        <TonLogo size={24} />
      </div>

      {showButtons && (
        <div className="flex gap-4">
          <Button
            onClick={handleDeposit}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg backdrop-blur-sm"
          >
            Deposit +
          </Button>
        </div>
      )}
    </div>
  )
}
