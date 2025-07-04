"use client"

import { useEffect, useState } from "react"

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    start_param?: string
  }
  ready: () => void
  expand: () => void
  close: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [startParam, setStartParam] = useState<string | null>(null)

  const getUserPhoto = async (userId: number): Promise<string | null> => {
    try {
      const response = await fetch(`/api/telegram/user-photo/${userId}`)
      const data = await response.json()
      return data.photo_url || null
    } catch (error) {
      console.error("Error fetching user photo:", error)
      return null
    }
  }

  useEffect(() => {
    const initTelegram = async () => {
      try {
        if (typeof window !== "undefined" && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp
          tg.ready()
          tg.expand()

          const user = tg.initDataUnsafe.user
          const startParam = tg.initDataUnsafe.start_param

          if (user) {
            console.log("Telegram user:", user)
            console.log("Start param:", startParam)

            // Fetch user photo
            const photoUrl = await getUserPhoto(user.id)

            const userWithPhoto = {
              ...user,
              photo_url: photoUrl,
            }

            setUser(userWithPhoto)
            setStartParam(startParam || null)

            // Save user data and process referral
            try {
              await fetch("/api/telegram/save-user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user: userWithPhoto,
                  referrer: startParam,
                }),
              })
            } catch (error) {
              console.error("Error saving user:", error)
            }
          } else {
            console.log("No user data available")
          }
        } else {
          console.log("Telegram WebApp not available, using mock data for development")
          // Mock data for development
          const mockUser = {
            id: 123456789,
            first_name: "Test User",
            username: "testuser",
            photo_url: null,
          }
          setUser(mockUser)
        }
      } catch (error) {
        console.error("Error initializing Telegram:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initTelegram()
  }, [])

  return {
    user,
    isLoading,
    startParam,
    getUserPhoto,
  }
}
