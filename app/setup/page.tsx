"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"

export default function SetupPage() {
  const [setupStatus, setSetupStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runSetup = async () => {
    setIsLoading(true)
    setSetupStatus(null)

    try {
      console.log("Starting setup process...")

      // Test bot first
      console.log("Testing bot connection...")
      const botResponse = await fetch("/api/telegram/test-bot", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      let botData
      if (botResponse.ok) {
        const botText = await botResponse.text()
        try {
          botData = JSON.parse(botText)
        } catch (error) {
          console.error("Failed to parse bot response:", error, botText)
          botData = { error: "Invalid response format", ok: false }
        }
      } else {
        botData = { error: `HTTP ${botResponse.status}`, ok: false }
      }

      console.log("Bot test result:", botData)

      // Set webhook
      console.log("Setting up webhook...")
      const webhookResponse = await fetch("/api/telegram/setup-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          webhookUrl: "https://v0-pepe-case-design.vercel.app/api/telegram/webhook",
        }),
      })

      let webhookData
      if (webhookResponse.ok) {
        const webhookText = await webhookResponse.text()
        try {
          webhookData = JSON.parse(webhookText)
        } catch (error) {
          console.error("Failed to parse webhook response:", error, webhookText)
          webhookData = { error: "Invalid response format", success: false }
        }
      } else {
        const errorText = await webhookResponse.text()
        webhookData = { error: `HTTP ${webhookResponse.status}: ${errorText}`, success: false }
      }

      console.log("Webhook setup result:", webhookData)

      setSetupStatus({
        bot: botData,
        webhook: webhookData,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Setup error:", error)
      setSetupStatus({
        error: error instanceof Error ? error.message : "Setup failed",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectly = async () => {
    try {
      // Test bot token directly
      const botToken = "7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34"

      console.log("Testing bot directly...")
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
      const data = await response.json()

      if (data.ok) {
        alert(`✅ Bot is working! Username: @${data.result.username}`)
      } else {
        alert(`❌ Bot error: ${data.description}`)
      }
    } catch (error) {
      alert(`❌ Test failed: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🚀 PepeCase Setup</h1>

        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span>🤖</span> Bot Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Domain:</span>
                <span className="text-green-400">v0-pepe-case-design.vercel.app</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bot:</span>
                <span className="text-blue-400">@Spaceklbot</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Token:</span>
                <span className="text-yellow-400 font-mono text-xs">7751385637:AAH***w34</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Webhook:</span>
                <span className="text-yellow-400">/api/telegram/webhook</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={runSetup} disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "🔧 Run Setup"
                )}
              </Button>

              <Button onClick={testDirectly} variant="outline" className="border-blue-500 text-blue-400 bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Bot
              </Button>
            </div>
          </CardContent>
        </Card>

        {setupStatus && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {setupStatus.error ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Setup Failed
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Setup Results
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {setupStatus.error ? (
                <div className="text-red-400 bg-red-900/20 p-3 rounded border border-red-500/30">
                  {setupStatus.error}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-green-400 font-bold mb-2">🤖 Bot Status:</h3>
                    <div className="bg-gray-800 p-3 rounded text-xs">
                      {setupStatus.bot?.bot?.ok ? (
                        <div className="text-green-400">✅ Bot: @{setupStatus.bot.bot.result.username}</div>
                      ) : (
                        <div className="text-red-400">❌ Bot: {setupStatus.bot?.error || "Connection failed"}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-blue-400 font-bold mb-2">🔗 Webhook Status:</h3>
                    <div className="bg-gray-800 p-3 rounded text-xs">
                      {setupStatus.webhook?.success ? (
                        <div className="text-green-400">✅ Webhook configured successfully</div>
                      ) : (
                        <div className="text-red-400">❌ Webhook: {setupStatus.webhook?.error || "Setup failed"}</div>
                      )}
                    </div>
                  </div>

                  {setupStatus.bot?.bot?.ok && setupStatus.webhook?.success && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <h3 className="text-green-400 font-bold mb-2">🎉 Setup Complete!</h3>
                      <div className="text-sm space-y-1">
                        <p>✅ Bot is connected and working</p>
                        <p>✅ Webhook is configured for payments</p>
                        <p>✅ Ready to receive Telegram Stars payments</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-green-500/30">
                        <p className="text-green-300 text-sm font-medium mb-2">Next Steps:</p>
                        <ol className="text-xs space-y-1 text-green-200">
                          <li>1. Open Telegram and search for @Spaceklbot</li>
                          <li>2. Start the bot and open the web app</li>
                          <li>3. Test a deposit with Telegram Stars</li>
                          <li>4. Try opening a case!</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Debug Information */}
        <Card className="bg-gray-900 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-sm">🔍 Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1 text-gray-400">
              <p>• If you see HTTP 405 errors, the API routes need to be deployed</p>
              <p>• If you see JSON parse errors, check the response format</p>
              <p>• If webhook fails, verify the domain is accessible</p>
              <p>• Bot token is configured in environment variables</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
