import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNavigation } from "@/components/bottom-navigation"
import { SoundControls } from "@/components/sound-controls"
import { TonConnectProvider } from "@/components/ton-connect-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spark",
  description: "Open boxes and win prizes!",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen pb-20`}>
        <TonConnectProvider>
          <div className="relative min-h-screen">
            <main className="pb-20">{children}</main>
            <BottomNavigation />
            <SoundControls />
          </div>
        </TonConnectProvider>
      </body>
    </html>
  )
}
