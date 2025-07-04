"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    setTestResults(null)

    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[],
    }

    // Test 1: Bot API
    try {
      console.log("Testing bot API...")
      const response = await fetch("/api/telegram/test-bot")
      const data = await response.json()
      results.tests.push({
        name: "Bot API",
        status: response.ok ? "✅ PASS" : "❌ FAIL",
        details: response.ok ? `Bot: @${data.bot?.result?.username}` : `Error: ${response.status}`,
        data: data,
      })
    } catch (error) {
      results.tests.push({
        name: "Bot API",
        status: "❌ FAIL",
        details: `Error: ${error}`,
      })
    }

    // Test 2: Stars Invoice API
    try {
      console.log("Testing Stars invoice API...")
      const testPayload = {
        userId: 123456789,
        amount: 100,
        tonAmount: 1,
        description: "Test payment",
        payload: "test_123",
      }

      const response = await fetch("/api/telegram/create-stars-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
      })

      const data = await response.json()
      results.tests.push({
        name: "Stars Invoice API",
        status: response.ok ? "✅ PASS" : "❌ FAIL",
        details: response.ok ? "Invoice created successfully" : `Error: ${response.status} - ${data.error}`,
        data: data,
      })
    } catch (error) {
      results.tests.push({
        name: "Stars Invoice API",
        status: "❌ FAIL",
        details: `Error: ${error}`,
      })
    }

    // Test 3: Webhook Setup API
    try {
      console.log("Testing webhook setup API...")
      const response = await fetch("/api/telegram/setup-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: "https://v0-pepe-case-design.vercel.app/api/telegram/webhook",
        }),
      })

      const data = await response.json()
      results.tests.push({
        name: "Webhook Setup API",
        status: response.ok ? "✅ PASS" : "❌ FAIL",
        details: response.ok ? "Webhook configured" : `Error: ${response.status} - ${data.error}`,
        data: data,
      })
    } catch (error) {
      results.tests.push({
        name: "Webhook Setup API",
        status: "❌ FAIL",
        details: `Error: ${error}`,
      })
    }

    // Test 4: Environment Variables
    const envTest = {
      name: "Environment Variables",
      status: "ℹ️ INFO",
      details: "Check server logs for bot token configuration",
    }
    results.tests.push(envTest)

    setTestResults(results)
    setIsLoading(false)
  }

  const testDirectBot = async () => {
    try {
      const botToken = "7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34"
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
      const data = await response.json()

      if (data.ok) {
        alert(`✅ Direct bot test successful!\nBot: @${data.result.username}\nID: ${data.result.id}`)
      } else {
        alert(`❌ Direct bot test failed: ${data.description}`)
      }
    } catch (error) {
      alert(`❌ Direct bot test error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🧪 API Test Suite</h1>

        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Test All APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={runTests} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "🧪 Run All Tests"
                )}
              </Button>

              <Button
                onClick={testDirectBot}
                variant="outline"
                className="border-green-500 text-green-400 bg-transparent"
              >
                🤖 Test Bot Direct
              </Button>
            </div>
          </CardContent>
        </Card>

        {testResults && (
          <div className="space-y-4">
            {testResults.tests.map((test: any, index: number) => (
              <Card key={index} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {test.status.includes("✅") ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : test.status.includes("❌") ? (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-blue-400" />
                    )}
                    {test.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status:</span>
                      <span className={test.status.includes("✅") ? "text-green-400" : "text-red-400"}>
                        {test.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Details:</span>
                      <p className="text-white text-sm mt-1">{test.details}</p>
                    </div>
                    {test.data && (
                      <details className="mt-2">
                        <summary className="text-gray-400 cursor-pointer text-sm">Raw Response</summary>
                        <pre className="bg-gray-800 p-2 rounded text-xs mt-2 overflow-auto">
                          {JSON.stringify(test.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">📋 Deployment Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">1. Environment Variables:</span>
                    <span className="text-yellow-400">Add TELEGRAM_BOT_TOKEN to Vercel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">2. API Routes:</span>
                    <span className="text-yellow-400">Deploy latest code to Vercel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">3. Webhook URL:</span>
                    <span className="text-yellow-400">Configure webhook after deployment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">4. Test Payments:</span>
                    <span className="text-yellow-400">Try Stars payment after setup</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
