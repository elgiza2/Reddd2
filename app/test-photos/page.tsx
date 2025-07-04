"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function TestPhotosPage() {
  const [userId, setUserId] = useState("")
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserPhoto = async () => {
    if (!userId.trim()) {
      setError("Please enter a user ID")
      return
    }

    setLoading(true)
    setError(null)
    setPhotoUrl(null)

    try {
      const response = await fetch(`/api/telegram/user-photo/${userId}`)
      const data = await response.json()

      if (data.photo_url) {
        setPhotoUrl(data.photo_url)
      } else {
        setError("No photo found for this user")
      }
    } catch (err) {
      setError("Failed to fetch user photo")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="bg-black/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-center">Test User Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Telegram User ID</label>
              <Input
                type="number"
                placeholder="Enter user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button onClick={fetchUserPhoto} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Fetch Photo"
              )}
            </Button>

            {error && <div className="text-red-400 text-sm text-center p-2 bg-red-900/20 rounded">{error}</div>}

            {photoUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  <Image
                    src={photoUrl || "/placeholder.svg"}
                    alt="User photo"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`
                      }
                    }}
                  />
                </div>
                <div className="text-xs text-gray-400 text-center break-all">{photoUrl}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
