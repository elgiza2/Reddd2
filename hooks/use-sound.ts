"use client"

import { useCallback, useRef, useState, useEffect } from "react"

interface SoundOptions {
  volume?: number
  loop?: boolean
  playbackRate?: number
}

export function useSound() {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  // Initialize audio files
  useEffect(() => {
    const sounds = {
      click: "/sounds/click.mp3",
      boxOpen: "/sounds/box-open.mp3",
      spinning: "/sounds/spinning.mp3",
      win: "/sounds/win.mp3",
      bigWin: "/sounds/big-win.mp3",
      deposit: "/sounds/deposit.mp3",
      error: "/sounds/error.mp3",
      background: "/sounds/background.mp3",
    }

    Object.entries(sounds).forEach(([key, src]) => {
      const audio = new Audio(src)
      audio.preload = "auto"
      audio.volume = volume
      audioRefs.current[key] = audio
    })

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause()
        audio.src = ""
      })
    }
  }, [])

  // Update volume for all sounds
  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = isMuted ? 0 : volume
    })
  }, [volume, isMuted])

  const playSound = useCallback(
    (soundName: string, options: SoundOptions = {}) => {
      if (isMuted) return

      const audio = audioRefs.current[soundName]
      if (!audio) return

      try {
        audio.currentTime = 0
        audio.volume = options.volume ?? volume
        audio.loop = options.loop ?? false
        audio.playbackRate = options.playbackRate ?? 1

        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio play failed:", error)
          })
        }
      } catch (error) {
        console.log("Audio error:", error)
      }
    },
    [isMuted, volume],
  )

  const stopSound = useCallback((soundName: string) => {
    const audio = audioRefs.current[soundName]
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }, [])

  return {
    playSound,
    stopSound,
    stopAllSounds,
    isMuted,
    setIsMuted,
    volume,
    setVolume,
  }
}
