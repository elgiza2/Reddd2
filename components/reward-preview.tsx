"use client"

import { TonLogo } from "@/components/ton-logo"
import Image from "next/image"

interface Reward {
  name: string
  image: string
  value: number
}

interface RewardPreviewProps {
  rewards: Reward[]
  selectedIndex?: number
}

export function RewardPreview({ rewards, selectedIndex }: RewardPreviewProps) {
  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
        {rewards.map((reward, index) => (
          <div
            key={index}
            className={`flex-shrink-0 relative ${
              selectedIndex === index ? "transform scale-110" : ""
            } transition-all duration-300`}
          >
            <div className="w-32 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-4 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Glow effect for selected item */}
              {selectedIndex === index && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl animate-pulse"></div>
              )}

              {/* Item image */}
              <div className="w-20 h-20 mb-3 relative z-10">
                <Image
                  src={reward.image || "/placeholder.svg"}
                  alt={reward.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Item name */}
              <p className="text-white text-xs font-medium text-center mb-2 relative z-10 truncate w-full">
                {reward.name}
              </p>

              {/* Item value */}
              <div className="flex items-center gap-1 relative z-10">
                <span className="text-yellow-400 text-sm font-bold">{reward.value}</span>
                <TonLogo size={12} />
              </div>
            </div>

            {/* Selection indicator */}
            {selectedIndex === index && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
