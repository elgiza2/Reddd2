"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface LiveWin {
  id: string
  itemImage: string
  timestamp: number
}

// All available rewards (no duplicates)
const allRewards = [
  { image: "https://assets.pepecase.app/assets/lol_pop_wonka_berry.png" },
  { image: "https://assets.pepecase.app/assets/candy_cane_sugar_crush.png" },
  { image: "https://assets.pepecase.app/assets/jester_hat_dagonet.png" },
  { image: "https://assets.pepecase.app/assets/homemade_cake_pink_whirl.png" },
  { image: "https://assets.pepecase.app/assets/ginger_cookie_faint_blush.png" },
  { image: "https://assets.pepecase.app/assets/swiss_watch_top_gun.png" },
  { image: "https://assets.pepecase.app/assets/nail_bracelet_ultramarine.png" },
  { image: "https://assets.pepecase.app/assets/perfume_bottle_glow_verde.png" },
  { image: "https://assets.pepecase.app/assets/ion_gem_blood_gem.png" },
  { image: "https://assets.pepecase.app/assets/durov's_cap_pinkie_cap.png" },
  { image: "https://assets.pepecase.app/assets/magic_potion_queen_bee.png" },
  { image: "https://assets.pepecase.app/assets/scared_cat_nyan_cat.png" },
  { image: "https://assets.pepecase.app/assets/love_candle_setting_sun.png" },
  { image: "https://assets.pepecase.app/assets/bunny_muffin_grandma's_pie.png" },
  { image: "https://assets.pepecase.app/assets/cookie_heart_nyam_cat.png" },
  { image: "https://assets.pepecase.app/assets/jelly_bunny_commando.png" },
  { image: "https://assets.pepecase.app/assets/hypno_lollipop_saturn.png" },
  { image: "https://assets.pepecase.app/assets/loot_bag_city_life.png" },
  { image: "https://assets.pepecase.app/assets/heroic_helmet_mercurial.png" },
  { image: "https://assets.pepecase.app/assets/eternal_rose_moonstone.png" },
]

export function LiveWins() {
  const [wins, setWins] = useState<LiveWin[]>([])
  const [usedRewards, setUsedRewards] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Generate initial wins with unique rewards
    const initialWins = generateInitialWins()
    setWins(initialWins)

    // Add new win every 5 seconds
    const interval = setInterval(() => {
      const newWin = generateRandomWin(Date.now())
      if (newWin) {
        setWins((prev) => [newWin, ...prev.slice(0, 5)]) // Keep only 6 wins
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const generateInitialWins = (): LiveWin[] => {
    const shuffled = [...allRewards].sort(() => Math.random() - 0.5)
    const initialUsed = new Set<string>()

    const wins = shuffled.slice(0, 6).map((reward, index) => {
      initialUsed.add(reward.image)
      return {
        id: `initial-${index}`,
        itemImage: reward.image,
        timestamp: Date.now() - index * 1000,
      }
    })

    setUsedRewards(initialUsed)
    return wins
  }

  const generateRandomWin = (timestamp: number): LiveWin | null => {
    // Get unused rewards
    const unusedRewards = allRewards.filter((reward) => !usedRewards.has(reward.image))

    // If all rewards are used, reset the used set but keep the last few
    if (unusedRewards.length === 0) {
      const recentImages = new Set(wins.slice(0, 3).map((win) => win.itemImage))
      setUsedRewards(recentImages)
      const availableRewards = allRewards.filter((reward) => !recentImages.has(reward.image))

      if (availableRewards.length === 0) return null

      const selectedReward = availableRewards[Math.floor(Math.random() * availableRewards.length)]
      setUsedRewards((prev) => new Set([...prev, selectedReward.image]))

      return {
        id: `${timestamp}-${Math.random()}`,
        itemImage: selectedReward.image,
        timestamp,
      }
    }

    // Select from unused rewards
    const selectedReward = unusedRewards[Math.floor(Math.random() * unusedRewards.length)]
    setUsedRewards((prev) => new Set([...prev, selectedReward.image]))

    return {
      id: `${timestamp}-${Math.random()}`,
      itemImage: selectedReward.image,
      timestamp,
    }
  }

  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Live indicator */}
        <div className="flex-shrink-0 p-2 flex items-center justify-center min-w-[60px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-bold text-xs">Live</span>
          </div>
        </div>

        {/* Wins */}
        {wins.map((win, index) => (
          <div
            key={win.id}
            className={`flex-shrink-0 p-2 min-w-[60px] h-[60px] flex items-center justify-center transition-all duration-500 ${
              index === 0 ? "animate-fade-in" : ""
            }`}
          >
            <Image
              src={win.itemImage || "/placeholder.svg"}
              alt="Win"
              width={40}
              height={40}
              className="object-contain rounded"
              style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.1))" }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
