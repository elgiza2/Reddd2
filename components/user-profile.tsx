"use client"

import { useTelegram } from "@/hooks/use-telegram"
import { TonLogo } from "@/components/ton-logo"
import { Button } from "@/components/ui/button"
import { useSound } from "@/hooks/use-sound"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User } from "lucide-react"

interface UserProfileProps {
  balance: number
  showDeposit?: boolean
}

export function UserProfile({ balance, showDeposit = true }: UserProfileProps) {
  const { user, isLoading } = useTelegram()
  const { playSound } = useSound()
  const router = useRouter()

  const handleDeposit = () => {
    playSound("click")
    router.push("/deposit")
  }

  if (isLoading || !user) {
    return (
      <div className="flex justify-between items-center px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
          <div>
            <div className="w-20 h-4 bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        {showDeposit && <div className="w-24 h-8 bg-gray-700 rounded-full animate-pulse"></div>}
      </div>
    )
  }

  const displayName = user.first_name
  const hasPhoto = user.photo_url && user.photo_url !== ""

  return (
    <div className="flex justify-between items-center px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          {hasPhoto ? (
            <Image
              src={user.photo_url! || "/placeholder.svg"}
              alt={displayName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                // Show fallback icon
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`
                }
              }}
            />
          ) : (
            <User className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <div>
          <div className="text-gray-400 text-sm">{displayName}</div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">{balance.toFixed(2)}</span>
            <TonLogo size={16} />
          </div>
        </div>
      </div>
      {showDeposit && (
        <Button
          onClick={handleDeposit}
          className="bg-green-400 hover:bg-green-500 text-black font-bold px-6 py-2 rounded-full"
        >
          Deposit +
        </Button>
      )}
    </div>
  )
}
