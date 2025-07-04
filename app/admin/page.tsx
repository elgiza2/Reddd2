"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [botStatus, setBotStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testBot = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/telegram/test-bot")
      const data = await response.json()
      setBotStatus(data)
    } catch (error) {
      console.error("Error testing bot:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const setupWebhook = async () => {
    if (!webhookUrl) {
      alert("Please enter webhook URL")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/telegram/setup-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ webhookUrl }),
      })

      const data = await response.json()
      if (data.success) {
        alert("Webhook set successfully!")
        testBot() // Refresh status
      } else {
        alert(`Failed to set webhook: ${data.error}`)
      }
    } catch (error) {
      console.error("Error setting webhook:", error)
      alert("Error setting webhook")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">PepeCase Admin Panel</h1>

        <div className="grid gap-6">
          {/* Bot Status */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Bot Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={testBot} disabled={isLoading} className="mb-4">
                {isLoading ? "Testing..." : "Test Bot Connection"}
              </Button>

              {botStatus && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-green-400 font-bold">Bot Info:</h3>
                    <pre className="bg-gray-800 p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(botStatus.bot, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-blue-400 font-bold">Webhook Info:</h3>
                    <pre className="bg-gray-800 p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(botStatus.webhook, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Webhook Setup */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Webhook Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Webhook URL</label>
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-domain.vercel.app/api/telegram/webhook"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <Button onClick={setupWebhook} disabled={isLoading || !webhookUrl}>
                  {isLoading ? "Setting up..." : "Set Webhook"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bot Configuration */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Bot Token:</span>
                  <span className="text-green-400 ml-2">7751385637:AAH***w34</span>
                </div>
                <div>
                  <span className="text-gray-400">Bot Username:</span>
                  <span className="text-blue-400 ml-2">@Spaceklbot</span>
                </div>
                <div>
                  <span className="text-gray-400">TON Wallet:</span>
                  <span className="text-yellow-400 ml-2 font-mono text-xs">
                    UQDpWr5-kwW8BF2bsqi7v82gjDoR6E71wvf0vGVWKUMSvV0Q
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
