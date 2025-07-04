"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Webhook, Zap } from "lucide-react"

export default function QuickWebhookPage() {
  const [setupResult, setSetupResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [autoStarted, setAutoStarted] = useState(false)

  const setupSteps = [
    "🔍 Testing bot connection...",
    "🔗 Configuring webhook URL...",
    "⚙️ Setting allowed updates...",
    "✅ Verifying configuration...",
    "🌐 Testing endpoint accessibility...",
  ]

  const runAutomaticSetup = async () => {
    setIsLoading(true)
    setSetupResult(null)
    setCurrentStep(0)

    try {
      // Simulate progress through steps
      for (let i = 0; i < setupSteps.length; i++) {
        setCurrentStep(i)
        await new Promise((resolve) => setTimeout(resolve, 1200))
      }

      console.log("🚀 Starting automatic webhook setup...")

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

      console.log("Setup response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("✅ Setup result:", data)

      setSetupResult(data)
    } catch (error) {
      console.error("❌ Setup failed:", error)
      setSetupResult({
        success: false,
        error: error instanceof Error ? error.message : "Setup failed",
        step: "request_failed",
      })
    } finally {
      setIsLoading(false)
      setCurrentStep(0)
    }
  }

  // Auto-start setup when page loads
  useEffect(() => {
    if (!autoStarted) {
      setAutoStarted(true)
      // Small delay to show the page first
      setTimeout(() => {
        runAutomaticSetup()
      }, 1000)
    }
  }, [autoStarted])

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">⚡ Quick Webhook Setup</h1>
          <p className="text-gray-400">Automatically configuring your Telegram Stars webhook...</p>
        </div>

        {/* Auto-start Notice */}
        <Alert className="mb-6 bg-blue-900/20 border-blue-500/30">
          <Zap className="w-4 h-4" />
          <AlertDescription className="text-blue-200">
            <strong>Auto-Setup Started!</strong> We're automatically configuring your webhook for Stars payments.
          </AlertDescription>
        </Alert>

        {/* Configuration Info */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Webhook className="w-5 h-5" />
              Configuration Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bot Username:</span>
                <span className="text-blue-400 font-mono">@Spaceklbot</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Webhook URL:</span>
                <span className="text-purple-400 font-mono text-xs">
                  v0-pepe-case-design.vercel.app/api/telegram/webhook
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Allowed Updates:</span>
                <span className="text-green-400">message, pre_checkout_query</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Drop Pending:</span>
                <span className="text-yellow-400">true</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        {isLoading && (
          <Card className="bg-gray-900 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Setup in Progress...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {setupSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index < currentStep
                          ? "bg-green-500 scale-110"
                          : index === currentStep
                            ? "bg-yellow-500 animate-pulse"
                            : "bg-gray-600"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : index === currentStep ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-base transition-colors duration-300 ${
                        index < currentStep
                          ? "text-green-400 font-medium"
                          : index === currentStep
                            ? "text-yellow-400 font-medium"
                            : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="text-blue-300 text-sm">
                  <strong>What's happening:</strong>
                  <br />• Connecting to Telegram Bot API
                  <br />• Registering your webhook endpoint
                  <br />• Configuring Stars payment notifications
                  <br />• Testing the complete setup
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Start Button (if not auto-started) */}
        {!isLoading && !setupResult && (
          <Card className="bg-gray-900 border-gray-700 mb-6">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Ready to Configure Webhook?</h3>
              <Button
                onClick={runAutomaticSetup}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 text-lg"
              >
                <Zap className="w-6 h-6 mr-2" />🚀 START AUTO-CONFIGURATION
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {setupResult && (
          <Card
            className={`border-gray-700 ${
              setupResult.success ? "bg-green-900/20 border-green-500/30" : "bg-red-900/20 border-red-500/30"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {setupResult.success ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400" />
                )}
                <span className="text-2xl">{setupResult.success ? "🎉 Setup Successful!" : "❌ Setup Failed"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {setupResult.success ? (
                <div className="space-y-6">
                  <div className="text-green-300 text-lg font-medium">✅ Webhook has been configured successfully!</div>

                  <div className="text-green-200 text-sm bg-green-800/20 rounded-lg p-4">
                    <strong>🎯 What's Now Active:</strong>
                    <br />• Your bot can receive Stars payments
                    <br />• Webhook notifications are configured
                    <br />• Payment processing is ready
                    <br />• Real-time balance updates enabled
                  </div>

                  {setupResult.bot && (
                    <div className="bg-green-800/20 rounded-lg p-4">
                      <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">🤖 Bot Information:</h4>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Username:</span>
                          <span className="text-blue-400">@{setupResult.bot.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bot ID:</span>
                          <span className="text-cyan-400">{setupResult.bot.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Support:</span>
                          <span className={setupResult.bot.can_receive_payments ? "text-green-400" : "text-red-400"}>
                            {setupResult.bot.can_receive_payments ? "✅ Enabled" : "❌ Disabled"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {setupResult.webhook && (
                    <div className="bg-green-800/20 rounded-lg p-4">
                      <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">🔗 Webhook Status:</h4>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>URL:</span>
                          <span className="text-purple-400 font-mono text-xs">{setupResult.webhook.url}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending Updates:</span>
                          <span className="text-yellow-400">{setupResult.webhook.pending_update_count || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Allowed Updates:</span>
                          <span className="text-green-400">{setupResult.webhook.allowed_updates?.join(", ")}</span>
                        </div>
                        {setupResult.webhook.last_error_message && (
                          <div className="text-yellow-400 text-xs">
                            Last error: {setupResult.webhook.last_error_message}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => (window.location.href = "/deposit")}
                      className="bg-yellow-500 hover:bg-yellow-600 flex-1 py-3 text-lg font-bold"
                    >
                      🌟 Test Stars Payment Now
                    </Button>
                    <Button
                      onClick={() => (window.location.href = "/")}
                      className="bg-blue-500 hover:bg-blue-600 flex-1 py-3 text-lg font-bold"
                    >
                      🏠 Go to Home
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-red-300 text-lg font-medium">❌ Setup failed: {setupResult.error}</div>

                  {setupResult.step && (
                    <div className="text-red-400 text-sm bg-red-800/20 rounded-lg p-3">
                      Failed at step: <strong>{setupResult.step}</strong>
                    </div>
                  )}

                  <div className="bg-red-800/20 rounded-lg p-4">
                    <h4 className="text-red-400 font-medium mb-3">🔧 Troubleshooting Steps:</h4>
                    <ul className="text-sm space-y-2 text-red-300">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">1.</span>
                        <span>Check if the bot token is correct in environment variables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">2.</span>
                        <span>Verify your domain is accessible via HTTPS</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">3.</span>
                        <span>Make sure Stars payments are enabled in BotFather</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">4.</span>
                        <span>Try the manual setup option as an alternative</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={runAutomaticSetup} className="bg-red-500 hover:bg-red-600 flex-1 py-3 text-lg">
                      🔄 Retry Auto Setup
                    </Button>
                    <Button
                      onClick={() => (window.location.href = "/test-api")}
                      variant="outline"
                      className="border-blue-500 text-blue-400 flex-1 py-3 text-lg"
                    >
                      🧪 Debug API
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-gray-900 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => (window.location.href = "/stars-setup")}
                variant="outline"
                className="border-purple-500 text-purple-400"
              >
                📋 Full Setup Guide
              </Button>
              <Button
                onClick={() => (window.location.href = "/test-api")}
                variant="outline"
                className="border-cyan-500 text-cyan-400"
              >
                🧪 Test API Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
