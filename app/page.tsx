"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [apiKey, setApiKey] = useState("")
  const [isApiKeyValid, setIsApiKeyValid] = useState(false)
  const [isApiKeyLoading, setIsApiKeyLoading] = useState(false)

  const handleApiKeySubmit = async (e: any) => {
    e.preventDefault()

    setIsApiKeyLoading(true)

    // Simulate API key validation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (apiKey === "valid_api_key") {
      setIsApiKeyValid(true)
      toast.success("API Key is valid!")
    } else {
      setIsApiKeyValid(false)
      toast.error("Invalid API Key. Please try again.")
    }

    setIsApiKeyLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-500 to-gray-100 rounded-b-3xl"></div>
      <Card className="w-[90%] max-w-md z-10">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>Enter your API key to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isApiKeyLoading}
              />
            </div>
            <Button disabled={isApiKeyLoading} type="submit" className="w-full">
              {isApiKeyLoading ? "Validating..." : "Validate API Key"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            Status:{" "}
            <span
              className={cn({
                "text-green-500": isApiKeyValid,
                "text-red-500": !isApiKeyValid && apiKey !== "",
                "text-gray-500": apiKey === "",
              })}
            >
              {isApiKeyValid ? "Valid" : !isApiKeyValid && apiKey !== "" ? "Invalid" : "Not validated"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
