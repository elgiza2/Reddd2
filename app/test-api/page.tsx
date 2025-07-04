"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testStarsAPI = async () => {
    setIsLoading(true)
    setTestResults(null)

    try {
      console.log("Testing Stars API...")

      const testPayload = {
        userId: 123456789,
        amount: 100,
        tonAmount: 1,
        description: "Test Stars payment",
        payload: "test_stars_123",
      }

      console.log("Sending test payload:", testPayload)

      const response = await fetch("/api/telegram/create-stars-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(testPayload),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log("Response text:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        data = { error: "Failed to parse JSON", responseText }
      }

      setTestResults({
        status: response.ok ? "✅ SUCCESS" : "❌ FAILED",
        statusCode: response.status,
        data: data,
        responseText: responseText,
      })
    } catch (error) {
      console.error("Test failed:", error)
      setTestResults({
        status: "❌ ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testBotAPI = async () => {
    try {
      const response = await fetch("/api/telegram/test-bot")
      const data = await response.json()

      alert(
        response.ok ? `✅ Bot API working!\nBot: @${data.bot?.result?.username}` : `❌ Bot API failed: ${data.error}`,
      )
    } catch (error) {
      alert(`❌ Bot API error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🧪 API Test Suite</h1>

        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Test APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={testStarsAPI} disabled={isLoading} className="bg-yellow-500 hover:bg-yellow-600">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "🌟 Test Stars API"
                )}
              </Button>

              <Button onClick={testBotAPI} variant="outline" className="border-blue-500 text-blue-400 bg-transparent">
                🤖 Test Bot API
              </Button>
            </div>
          </CardContent>
        </Card>

        {testResults && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {testResults.status.includes("✅") ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`ml-2 font-bold ${
                      testResults.status.includes("✅") ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {testResults.status}
                  </span>
                </div>

                {testResults.statusCode && (
                  <div>
                    <span className="text-gray-400">HTTP Status:</span>
                    <span className="text-white ml-2">{testResults.statusCode}</span>
                  </div>
                )}

                {testResults.error && (
                  <div>
                    <span className="text-gray-400">Error:</span>
                    <p className="text-red-400 text-sm mt-1">{testResults.error}</p>
                  </div>
                )}

                {testResults.data && (
                  <div>
                    <span className="text-gray-400">Response Data:</span>
                    <pre className="bg-gray-800 p-3 rounded text-xs mt-2 overflow-auto">
                      {JSON.stringify(testResults.data, null, 2)}
                    </pre>
                  </div>
                )}

                {testResults.responseText && (
                  <div>
                    <span className="text-gray-400">Raw Response:</span>
                    <pre className="bg-gray-800 p-3 rounded text-xs mt-2 overflow-auto max-h-32">
                      {testResults.responseText}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
