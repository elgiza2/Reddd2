"use client"

import { useEffect, useState } from "react"

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    chat?: any
    start_param?: string
  }
  version: string
  platform: string
  colorScheme: "light" | "dark"
  themeParams: any
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
    setParams: (params: any) => void
  }
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void
    notificationOccurred: (type: "error" | "success" | "warning") => void
    selectionChanged: () => void
  }
  showPopup: (params: any, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showScanQrPopup: (params: any, callback?: (text: string) => void) => void
  closeScanQrPopup: () => void
  readTextFromClipboard: (callback?: (text: string) => void) => void
  requestWriteAccess: (callback?: (granted: boolean) => void) => void
  requestContact: (callback?: (granted: boolean, contact?: any) => void) => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load Telegram WebApp script
    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-web-app.js"
    script.async = true

    script.onload = async () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        setWebApp(tg)

        // Initialize the app
        tg.ready()

        // Get user data
        if (tg.initDataUnsafe.user) {
          const telegramUser = tg.initDataUnsafe.user

          try {
            // Get user photo URL from our API
            const photoUrl = await getUserPhoto(telegramUser.id)

            setUser({
              ...telegramUser,
              photo_url: photoUrl,
            })
          } catch (error) {
            console.error("Error fetching user photo:", error)
            // Set user without photo
            setUser({
              ...telegramUser,
              photo_url: undefined,
            })
          }

          setIsLoading(false)
        } else {
          // Fallback user for development
          setUser({
            id: 123456789,
            first_name: "Hamza",
            username: "hamza_user",
            photo_url: undefined,
          })
          setIsLoading(false)
        }

        // Set theme
        if (tg.backgroundColor) {
          document.body.style.backgroundColor = tg.backgroundColor
        }
      } else {
        // Fallback for development
        setUser({
          id: 123456789,
          first_name: "Hamza",
          username: "hamza_user",
          photo_url: undefined,
        })
        setIsLoading(false)
      }
    }

    script.onerror = () => {
      // Fallback for development
      setUser({
        id: 123456789,
        first_name: "Hamza",
        username: "hamza_user",
        photo_url: undefined,
      })
      setIsLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const getUserPhoto = async (userId: number): Promise<string | undefined> => {
    try {
      console.log(`Fetching photo for user ${userId}`)

      const response = await fetch(`/api/telegram/user-photo/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error(`Failed to fetch user photo: ${response.status}`)
        return undefined
      }

      const data = await response.json()

      if (data.photo_url) {
        console.log(`Successfully got photo URL for user ${userId}`)
        return data.photo_url
      } else {
        console.log(`No photo available for user ${userId}`)
        return undefined
      }
    } catch (error) {
      console.error("Error in getUserPhoto:", error)
      return undefined
    }
  }

  const showMainButton = (text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text)
      webApp.MainButton.onClick(onClick)
      webApp.MainButton.show()
    }
  }

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide()
    }
  }

  const showBackButton = (onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(onClick)
      webApp.BackButton.show()
    }
  }

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide()
    }
  }

  const hapticFeedback = (type: "light" | "medium" | "heavy" | "success" | "error" | "warning" | "selection") => {
    if (webApp?.HapticFeedback) {
      if (type === "success" || type === "error" || type === "warning") {
        webApp.HapticFeedback.notificationOccurred(type)
      } else if (type === "selection") {
        webApp.HapticFeedback.selectionChanged()
      } else {
        webApp.HapticFeedback.impactOccurred(type)
      }
    }
  }

  const showAlert = (message: string) => {
    if (webApp?.showAlert) {
      webApp.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp?.showConfirm) {
        webApp.showConfirm(message, resolve)
      } else {
        resolve(confirm(message))
      }
    })
  }

  const close = () => {
    if (webApp?.close) {
      webApp.close()
    }
  }

  const expand = () => {
    if (webApp?.expand) {
      webApp.expand()
    }
  }

  return {
    webApp,
    user,
    isLoading,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    close,
    expand,
  }
}
