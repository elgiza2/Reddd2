"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Webhook } from "lucide-react"

export default function WebhookSetupPage() {
  const [setupResult, setSetupResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const setupSteps = [
    "Testing bot connection...",
    "Configuring webhook URL...",
    "Setting allowed updates...",
    "Verifying configuration...",
    "Testing endpoint accessibility...",
  ]

  const runAutomaticSetup = async () => {
    setIsLoading(true)
    setSetupResult(null)
    setCurrentStep(0)

    try {
      // Simulate progress through steps
      for (let i = 0; i < setupSteps.length; i++) {
        setCurrentStep(i)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      console.log("Starting automatic webhook setup...")

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
      console.log("Setup result:", data)

      setSetupResult(data)
    } catch (error) {
      console.error("Setup failed:", error)
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

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🔧 Automatic Webhook Setup</h1>

        <Alert className="mb-6 bg-blue-900/20 border-blue-500/30">
          <Webhook className="w-4 h-4" />
          <AlertDescription className="text-blue-200">
            This will automatically configure your Telegram bot webhook for Stars payments.
          </AlertDescription>
        </Alert>

        {/* Configuration Info */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Configuration Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Bot:</span>
                <span className="text-blue-400">@Spaceklbot</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Webhook URL:</span>
                <span className="text-purple-400 font-mono text-xs">
                  v0-pepe-case-design.vercel.app/api/telegram/webhook
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Updates:</span>
                <span className="text-green-400">message, pre_checkout_query</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Button */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardContent className="p-6">
            <Button
              onClick={runAutomaticSetup}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Setting up webhook...
                </>
              ) : (
                <>
                  <Webhook className="w-5 h-5 mr-2" />🚀 Start Automatic Setup
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        {isLoading && (
          <Card className="bg-gray-900 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Setup Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {setupSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        index < currentStep ? "bg-green-500" : index === currentStep ? "bg-yellow-500" : "bg-gray-600"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : index === currentStep ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <span className="text-white text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        index < currentStep
                          ? "text-green-400"
                          : index === currentStep
                            ? "text-yellow-400"
                            : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
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
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                Setup {setupResult.success ? "Successful" : "Failed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {setupResult.success ? (
                <div className="space-y-4">
                  <div className="text-green-300 text-sm">✅ Webhook has been configured successfully!</div>

                  {setupResult.bot && (
                    <div className="bg-green-800/20 rounded-lg p-3">
                      <h4 className="text-green-400 font-medium mb-2">Bot Information:</h4>
                      <div className="text-sm space-y-1">
                        <div>Username: @{setupResult.bot.username}</div>
                        <div>ID: {setupResult.bot.id}</div>
                        <div>Can receive payments: {setupResult.bot.can_receive_payments ? "✅ Yes" : "❌ No"}</div>
                      </div>
                    </div>
                  )}

                  {setupResult.webhook && (
                    <div className="bg-green-800/20 rounded-lg p-3">
                      <h4 className="text-green-400 font-medium mb-2">Webhook Status:</h4>
                      <div className="text-sm space-y-1">
                        <div>URL: {setupResult.webhook.url}</div>
                        <div>Pending updates: {setupResult.webhook.pending_update_count || 0}</div>
                        <div>Allowed updates: {setupResult.webhook.allowed_updates?.join(", ")}</div>
                        {setupResult.webhook.last_error_message && (
                          <div className="text-yellow-400">Last error: {setupResult.webhook.last_error_message}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => (window.location.href = "/deposit")}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      🌟 Test Stars Payment
                    </Button>
                    <Button
                      onClick={() => (window.location.href = "/stars-setup")}
                      variant="outline"
                      className="border-green-500 text-green-400"
                    >
                      ← Back to Setup
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-red-300 text-sm">❌ Setup failed: {setupResult.error}</div>

                  {setupResult.step && <div className="text-red-400 text-xs">Failed at step: {setupResult.step}</div>}

                  <div className="bg-red-800/20 rounded-lg p-3">
                    <h4 className="text-red-400 font-medium mb-2">Troubleshooting:</h4>
                    <ul className="text-sm space-y-1 text-red-300">
                      <li>• Check if the bot token is correct</li>
                      <li>• Verify your domain is accessible via HTTPS</li>
                      <li>• Make sure Stars payments are enabled in BotFather</li>
                      <li>• Try the manual setup option</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={runAutomaticSetup} className="bg-red-500 hover:bg-red-600">
                      🔄 Retry Setup
                    </Button>
                    <Button
                      onClick={() => (window.location.href = "/test-api")}
                      variant="outline"
                      className="border-blue-500 text-blue-400"
                    >
                      🧪 Debug API
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
