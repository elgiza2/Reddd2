"use client"

import { useTonConnect } from "@/hooks/use-ton-connect"
import { Button } from "@/components/ui/button"
import { TonLogo } from "@/components/ton-logo"
import { Wallet, Copy, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useSound } from "@/hooks/use-sound"

interface TonWalletConnectProps {
  onPaymentSuccess?: () => void
  showBalance?: boolean
}

export function TonWalletConnect({ onPaymentSuccess, showBalance = false }: TonWalletConnectProps) {
  const { isConnected, walletAddress, connectWallet, disconnectWallet, formatAddress, isProcessing, error } =
    useTonConnect()

  const [copied, setCopied] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const { playSound } = useSound()

  // Clear connection error after 5 seconds
  useEffect(() => {
    if (connectionError) {
      const timer = setTimeout(() => {
        setConnectionError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [connectionError])

  // Update connection error from hook
  useEffect(() => {
    if (error && error.includes("connect")) {
      setConnectionError(error)
    }
  }, [error])

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

  const handleConnect = async () => {
    try {
      setConnectionError(null)
      await connectWallet()
    } catch (error) {
      console.error("Connection failed:", error)
      if (error instanceof Error) {
        setConnectionError(error.message)
      }
    }
  }

  const handleDisconnect = async () => {
    try {
      setConnectionError(null)
      await disconnectWallet()
    } catch (error) {
      console.error("Disconnection failed:", error)
      if (error instanceof Error) {
        setConnectionError(error.message)
      }
    }
  }

  if (isConnected && walletAddress) {
    return (
      <div className="space-y-4">
        {/* Connected Wallet Display */}
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium text-sm">Wallet Connected</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <TonLogo size={20} />
            <span className="text-white font-mono text-sm">{formatAddress(walletAddress)}</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={copyAddress}
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
              disabled={isProcessing}
            >
              {copied ? (
                "✓ Copied"
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>

            <Button
              onClick={openInExplorer}
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
              disabled={isProcessing}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Explorer
            </Button>

            <Button
              onClick={handleDisconnect}
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : "Disconnect"}
            </Button>
          </div>
        </div>

        {showBalance && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">💡 Ready for Payments</h4>
            <p className="text-blue-300 text-sm">
              Your wallet is connected and ready to send TON payments to PepeCase.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Connection Error */}
      {connectionError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm">{connectionError}</span>
        </div>
      )}

      {/* Connect Wallet Button */}
      <Button
        onClick={handleConnect}
        disabled={isProcessing}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <TonLogo size={16} />
            Connect TON Wallet
          </>
        )}
      </Button>
    </div>
  )
}
