"use client"

import { Home, User, Users, Trophy } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useSound } from "@/hooks/use-sound"

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { playSound } = useSound()

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: User, path: "/profile", label: "Profile" },
    { icon: Users, path: "/friends", label: "Friends" },
    { icon: Trophy, path: "/leaderboard", label: "Leaderboard" },
  ]

  const handleNavigation = (path: string) => {
    playSound("click")
    router.push(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="flex justify-around items-center py-2 px-2 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, path, label }) => (
          <button
            key={path}
            onClick={() => handleNavigation(path)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[50px] ${
              pathname === path ? "text-green-400 bg-green-400/10" : "text-gray-500 hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
