"use client"

import { Volume2, VolumeX, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSound } from "@/hooks/use-sound"

export function SoundControls() {
  const { isMuted, setIsMuted, volume, setVolume, playSound } = useSound()

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    playSound("click")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      playSound("click")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/10">
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-gray-900 border-gray-700">
          <div className="space-y-4">
            <h4 className="text-white font-medium">إعدادات الصوت</h4>

            <div className="space-y-2">
              <label className="text-white text-sm">مستوى الصوت</label>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="text-white/70 text-xs text-center">{Math.round(volume * 100)}%</div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm">كتم الصوت</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                className={`${isMuted ? "bg-red-500/20 border-red-500" : "bg-green-500/20 border-green-500"}`}
              >
                {isMuted ? "مكتوم" : "مفعل"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
