"use client"

import { TonConnectUIProvider } from "@tonconnect/ui-react"
import type { ReactNode } from "react"

interface TonConnectProviderProps {
  children: ReactNode
}

export function TonConnectProvider({ children }: TonConnectProviderProps) {
  return (
    <TonConnectUIProvider
      manifestUrl="https://v0-pepe-case-design.vercel.app/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/Spaceklbot",
      }}
    >
      {children}
    </TonConnectUIProvider>
  )
}
