"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function QuickFixPage() {
  const [webhookResult, setWebhookResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const setupWebhookDirect = async () => {
    setIsLoading(true)
    try {
      const botToken = "7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34"
      const webhookUrl = "https://v0-pepe-case-design.vercel.app/api/telegram/webhook"

      const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ["message", "pre_checkout_query"],
          drop_pending_updates: true,
        }),
      })

      const data = await response.json()
      setWebhookResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setWebhookResult(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkWebhook = async () => {
    try {
      const botToken = "7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34"
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
      const data = await response.json()
      setWebhookResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setWebhookResult(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">⚡ Quick Fix</h1>

        <Alert className="mb-6 bg-yellow-900/20 border-yellow-500/30">
          <AlertDescription className="text-yellow-200">
            <strong>HTTP 405 Error Fix:</strong> The API routes need to be deployed to Vercel with the environment
            variable TELEGRAM_BOT_TOKEN set.
          </AlertDescription>
        </Alert>

        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">🔧 Direct Webhook Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <div>
                  <span className="text-gray-400">Bot Token:</span>
                  <span className="text-green-400 ml-2 font-mono">7751385637:AAH***w34</span>
                </div>
                <div>
                  <span className="text-gray-400">Webhook URL:</span>
                  <span className="text-blue-400 ml-2 font-mono text-xs">
                    https://v0-pepe-case-design.vercel.app/api/telegram/webhook
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={setupWebhookDirect} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  {isLoading ? "Setting up..." : "🔗 Setup Webhook"}
                </Button>
                <Button
                  onClick={checkWebhook}
                  variant="outline"
                  className="border-blue-500 text-blue-400 bg-transparent"
                >
                  📊 Check Status
                </Button>
              </div>

              {webhookResult && (
                <div>
                  <h4 className="text-white font-medium mb-2">Result:</h4>
                  <pre className="bg-gray-800 p-3 rounded text-xs overflow-auto max-h-64">{webhookResult}</pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📋 Deployment Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  1
                </span>
                <div>
                  <p className="text-white font-medium">Add Environment Variable</p>
                  <p className="text-gray-400">In Vercel Dashboard → Settings → Environment Variables → Add:</p>
                  <code className="text-green-400 text-xs">
                    TELEGRAM_BOT_TOKEN=7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  2
                </span>
                <div>
                  <p className="text-white font-medium">Redeploy</p>
                  <p className="text-gray-400">Push code changes or trigger redeploy in Vercel</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  3
                </span>
                <div>
                  <p className="text-white font-medium">Setup Webhook</p>
                  <p className="text-gray-400">Use the "Setup Webhook" button above</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  4
                </span>
                <div>
                  <p className="text-white font-medium">Test Payments</p>
                  <p className="text-gray-400">Try Stars payment - HTTP 405 should be resolved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
