"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TonLogo } from "@/components/ton-logo"
import { useSound } from "@/hooks/use-sound"
import { Copy } from "lucide-react"

const WALLET_ADDRESS = "UQDpWr5-kwW8BF2bsqi7v82gjDoR6E71wvf0vGVWKUMSvV0Q"

interface TonWalletProps {
  onConnect?: (address: string) => void
}

export function TonWallet({ onConnect }: TonWalletProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { playSound } = useSound()

  const connectWallet = async () => {
    playSound("click")

    // Simulate wallet connection
    const demoAddress = WALLET_ADDRESS
    setWalletAddress(demoAddress)
    setIsConnected(true)
    localStorage.setItem("connectedWallet", demoAddress)
    onConnect?.(demoAddress)
    playSound("deposit")
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setIsConnected(false)
    localStorage.removeItem("connectedWallet")
    playSound("click")
  }

  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
        setCopied(true)
        playSound("click")
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error("Failed to copy:", error)
      }
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-lg">
          <TonLogo size={16} />
          <span className="text-green-400 text-sm font-medium">{formatAddress(walletAddress)}</span>
        </div>
        <Button onClick={copyAddress} variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs">
          {copied ? "✓" : <Copy className="w-3 h-3" />}
        </Button>
        <Button onClick={disconnectWallet} variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
    >
      <TonLogo size={16} />
      Connect TON Wallet
    </Button>
  )
}
