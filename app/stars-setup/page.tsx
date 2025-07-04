"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Star, Bot, Webhook, ExternalLink, Copy, AlertTriangle } from "lucide-react"

export default function StarsSetupPage() {
  const [setupStep, setSetupStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState("")

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const steps = [
    {
      id: 1,
      title: "Enable Stars Payments with BotFather",
      description: "Configure your bot to accept Telegram Stars",
      icon: <Star className="w-5 h-5" />,
      status: setupStep > 1 ? "completed" : setupStep === 1 ? "active" : "pending",
    },
    {
      id: 2,
      title: "Configure Webhook",
      description: "Set up webhook to receive payment notifications",
      icon: <Webhook className="w-5 h-5" />,
      status: setupStep > 2 ? "completed" : setupStep === 2 ? "active" : "pending",
    },
    {
      id: 3,
      title: "Test Real Payment",
      description: "Verify Stars payments are working",
      icon: <Bot className="w-5 h-5" />,
      status: setupStep > 3 ? "completed" : setupStep === 3 ? "active" : "pending",
    },
  ]

  const handleSetupStep = async (step: number) => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSetupStep(step + 1)
    setIsProcessing(false)
  }

  const openBotFather = () => {
    window.open("https://t.me/BotFather", "_blank")
  }

  const testWebhook = async () => {
    setIsProcessing(true)
    try {
      console.log("Starting automatic webhook setup...")

      // Show progress
      const progressSteps = [
        "Connecting to Telegram API...",
        "Configuring webhook URL...",
        "Setting allowed updates...",
        "Verifying configuration...",
        "Testing webhook response...",
      ]

      for (let i = 0; i < progressSteps.length; i++) {
        // Update UI with progress (you could add a progress state here)
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      const response = await fetch("/api/telegram/setup-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          webhookUrl: "https://v0-pepe-case-design.vercel.app/api/telegram/webhook",
        }),
      })

      console.log("Webhook setup response:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Webhook setup data:", data)

      if (data.success) {
        alert(
          "✅ Webhook configured successfully!\n\n" +
            "✓ URL: v0-pepe-case-design.vercel.app/api/telegram/webhook\n" +
            "✓ Updates: message, pre_checkout_query\n" +
            "✓ Status: Active\n\n" +
            "Your bot is now ready to receive Stars payments!",
        )
        setSetupStep(3)
      } else {
        throw new Error(data.error || "Webhook setup failed")
      }
    } catch (error) {
      console.error("Webhook setup error:", error)
      alert(
        `❌ Webhook setup failed: ${error instanceof Error ? error.message : "Unknown error"}\n\n` +
          "Please try:\n" +
          "1. Check your internet connection\n" +
          "2. Verify the bot token is correct\n" +
          "3. Try the manual setup option\n" +
          "4. Visit /test-api for more details",
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">⭐ Enable Real Stars Payments</h1>
          <p className="text-gray-400">Follow these steps to activate Telegram Stars for your bot</p>
        </div>

        {/* Current Status Alert */}
        <Alert className="mb-6 bg-yellow-900/20 border-yellow-500/30">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-yellow-200">
            <strong>Current Status:</strong> Stars payments are in demo mode. Complete these steps to enable real
            payments with Telegram Stars.
          </AlertDescription>
        </Alert>

        {/* Bot Information */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Your Bot Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Bot Username:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-blue-400 font-mono">@Spaceklbot</span>
                  <Button
                    onClick={() => copyToClipboard("@Spaceklbot", "username")}
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                  >
                    {copied === "username" ? "✓" : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Bot Token:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-400 font-mono text-xs">7751385637:AAH***w34</span>
                  <Button
                    onClick={() => copyToClipboard("7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34", "token")}
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                  >
                    {copied === "token" ? "✓" : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Webhook URL:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-purple-400 font-mono text-xs">
                    v0-pepe-case-design.vercel.app/api/telegram/webhook
                  </span>
                  <Button
                    onClick={() =>
                      copyToClipboard("https://v0-pepe-case-design.vercel.app/api/telegram/webhook", "webhook")
                    }
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                  >
                    {copied === "webhook" ? "✓" : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              <div>
                <span className="text-gray-400">Domain:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-cyan-400 font-mono text-xs">v0-pepe-case-design.vercel.app</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <Card
              key={step.id}
              className={`bg-gray-900 border-gray-700 ${
                step.status === "completed"
                  ? "border-green-500/30 bg-green-900/10"
                  : step.status === "active"
                    ? "border-yellow-500/30 bg-yellow-900/10"
                    : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div
                    className={`p-3 rounded-full ${
                      step.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : step.status === "active"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {step.status === "completed" ? <CheckCircle className="w-5 h-5" /> : step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl">
                      Step {step.id}: {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm font-normal">{step.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>

              {step.status === "active" && (
                <CardContent>
                  {step.id === 1 && (
                    <div className="space-y-6">
                      {/* BotFather Instructions */}
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="text-blue-400 font-medium mb-3 flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          BotFather Configuration
                        </h4>
                        <ol className="text-blue-300 text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                              1
                            </span>
                            <span>
                              Open Telegram and search for <strong>@BotFather</strong>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                              2
                            </span>
                            <span>
                              Send the command <code className="bg-gray-800 px-2 py-1 rounded">/mybots</code>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                              3
                            </span>
                            <span>
                              Select your bot: <strong>@Spaceklbot</strong>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                              4
                            </span>
                            <span>
                              Choose <strong>"Bot Settings"</strong>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                              5
                            </span>
                            <span>
                              Select <strong>"Payments"</strong>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                              6
                            </span>
                            <span>
                              Choose <strong>"Telegram Stars"</strong> and enable it
                            </span>
                          </li>
                        </ol>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={openBotFather}
                          className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open BotFather
                        </Button>

                        <Button
                          onClick={() => handleSetupStep(1)}
                          disabled={isProcessing}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          {isProcessing ? "Processing..." : "✅ I've Enabled Stars"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {step.id === 2 && (
                    <div className="space-y-6">
                      {/* Webhook Configuration */}
                      <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                        <h4 className="text-purple-400 font-medium mb-3 flex items-center gap-2">
                          <Webhook className="w-4 h-4" />
                          Webhook Configuration
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-400 text-sm">Webhook URL:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-gray-800 px-3 py-2 rounded text-xs flex-1">
                                https://v0-pepe-case-design.vercel.app/api/telegram/webhook
                              </code>
                              <Button
                                onClick={() =>
                                  copyToClipboard(
                                    "https://v0-pepe-case-design.vercel.app/api/telegram/webhook",
                                    "webhook-full",
                                  )
                                }
                                variant="outline"
                                size="sm"
                              >
                                {copied === "webhook-full" ? "✓" : <Copy className="w-3 h-3" />}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Allowed Updates:</span>
                            <code className="bg-gray-800 px-3 py-2 rounded text-xs block mt-1">
                              ["message", "pre_checkout_query"]
                            </code>
                          </div>
                        </div>
                      </div>

                      {/* Manual vs Automatic Setup */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                          <h5 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                            🤖 Automatic Setup - RECOMMENDED
                            {isProcessing && (
                              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                            )}
                          </h5>
                          <p className="text-green-300 text-sm mb-3">
                            {isProcessing
                              ? "Configuring webhook automatically..."
                              : "Let our system configure the webhook automatically"}
                          </p>
                          <div className="space-y-2 mb-3">
                            <div className="text-xs text-green-200">
                              ✓ Sets webhook URL to your domain
                              <br />✓ Configures payment notifications
                              <br />✓ Tests the connection
                              <br />✓ Verifies Stars payment support
                            </div>
                          </div>
                          <Button
                            onClick={testWebhook}
                            disabled={isProcessing}
                            className="w-full bg-green-500 hover:bg-green-600 text-lg py-3 font-bold"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Configuring Webhook...
                              </>
                            ) : (
                              <>🚀 CLICK HERE - Auto-Configure Webhook</>
                            )}
                          </Button>
                        </div>

                        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                          <h5 className="text-orange-400 font-medium mb-2">⚙️ Manual Setup</h5>
                          <p className="text-orange-300 text-sm mb-3">Configure webhook manually via BotFather</p>
                          <Button
                            onClick={() => handleSetupStep(2)}
                            variant="outline"
                            className="w-full border-orange-500 text-orange-400"
                          >
                            ✅ I've Set It Manually
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {step.id === 3 && (
                    <div className="space-y-6">
                      {/* Test Payment */}
                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                        <h4 className="text-yellow-400 font-medium mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Test Real Stars Payment
                        </h4>
                        <p className="text-yellow-300 text-sm mb-4">
                          Now that everything is configured, let's test a real Telegram Stars payment to make sure it
                          works correctly.
                        </p>
                        <div className="bg-yellow-600/20 rounded p-3 mb-4">
                          <p className="text-yellow-200 text-xs">
                            <strong>💡 Tip:</strong> Start with a small amount (0.1 TON = 10 Stars) to test the system.
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => (window.location.href = "/deposit")}
                          className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Test Stars Payment
                        </Button>

                        <Button
                          onClick={() => handleSetupStep(3)}
                          variant="outline"
                          className="border-green-500 text-green-400"
                        >
                          ✅ Payment Works!
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Success State */}
        {setupStep > 3 && (
          <Card className="bg-green-900/20 border-green-500/30 mt-8">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-green-400 font-bold text-2xl mb-3">🎉 Stars Payments Enabled!</h3>
              <p className="text-green-300 mb-6">
                Congratulations! Your bot is now configured to accept real Telegram Stars payments. Users can now
                deposit TON using their Telegram Stars balance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-800/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-2">✅ Bot Configured</h4>
                  <p className="text-green-300 text-sm">Stars payments enabled via BotFather</p>
                </div>
                <div className="bg-green-800/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-2">✅ Webhook Active</h4>
                  <p className="text-green-300 text-sm">Payment notifications configured</p>
                </div>
                <div className="bg-green-800/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-2">✅ System Ready</h4>
                  <p className="text-green-300 text-sm">Real payments are now working</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => (window.location.href = "/")} className="bg-green-500 hover:bg-green-600">
                  🏠 Go to Home
                </Button>
                <Button
                  onClick={() => (window.location.href = "/deposit")}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  💰 Make a Deposit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Troubleshooting */}
        <Card className="bg-gray-900 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white text-lg">🔧 Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h5 className="text-yellow-400 font-medium mb-2">Common Issues:</h5>
                <ul className="text-gray-400 space-y-1">
                  <li>
                    • <strong>Bot not found:</strong> Make sure the bot token is correct
                  </li>
                  <li>
                    • <strong>Webhook fails:</strong> Ensure your domain is accessible via HTTPS
                  </li>
                  <li>
                    • <strong>Payments not working:</strong> Check if Stars are enabled in BotFather
                  </li>
                  <li>
                    • <strong>No notifications:</strong> Verify webhook URL and allowed updates
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="text-blue-400 font-medium mb-2">Need Help?</h5>
                <p className="text-gray-400">
                  If you encounter issues, check the browser console for error messages or visit{" "}
                  <code className="bg-gray-800 px-2 py-1 rounded">/test-api</code> to debug the system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
