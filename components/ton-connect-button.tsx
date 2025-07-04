"use client"

import { TonConnectButton as TonConnectUIButton } from "@tonconnect/ui-react"
import { useTonConnect } from "@/hooks/use-ton-connect"
import { Button } from "@/components/ui/button"
import { TonLogo } from "@/components/ton-logo"
import { Copy, ExternalLink, Loader2 } from "lucide-react"
import { useState } from "react"
import { useSound } from "@/hooks/use-sound"

interface TonConnectButtonProps {
  className?: string
  showAddress?: boolean
}

export function TonConnectButton({ className = "", showAddress = true }: TonConnectButtonProps) {
  const { isConnected, walletAddress, formatAddress, disconnectWallet, isProcessing } = useTonConnect()
  const [copied, setCopied] = useState(false)
  const { playSound } = useSound()

  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
        setCopied(true)
        playSound("click")
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error("Failed to copy address:", error)
      }
    }
  }

  const openInExplorer = () => {
    if (walletAddress) {
      playSound("click")
      window.open(`https://tonscan.org/address/${walletAddress}`, "_blank")
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
    } catch (error) {
      console.error("Disconnect failed:", error)
    }
  }

  if (isConnected && walletAddress && showAddress) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-500/30">
          <TonLogo size={16} />
          <span className="text-blue-400 text-sm font-medium font-mono">{formatAddress(walletAddress)}</span>
        </div>

        <Button
          onClick={copyAddress}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white p-1"
          title="Copy address"
          disabled={isProcessing}
        >
          {copied ? "✓" : <Copy className="w-3 h-3" />}
        </Button>

        <Button
          onClick={openInExplorer}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white p-1"
          title="View on TONScan"
          disabled={isProcessing}
        >
          <ExternalLink className="w-3 h-3" />
        </Button>

        <Button
          onClick={handleDisconnect}
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : "Disconnect"}
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      <TonConnectUIButton />
    </div>
  )
}
