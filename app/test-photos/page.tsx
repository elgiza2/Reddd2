"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function TestPhotosPage() {
  const [userId, setUserId] = useState("")
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testPhoto = async () => {
    if (!userId) {
      setError("يرجى إدخال معرف المستخدم")
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
        setError("لم يتم العثور على صورة للمستخدم")
      }
    } catch (err) {
      setError("حدث خطأ أثناء جلب الصورة")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Card className="max-w-md mx-auto bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-center">اختبار صور المستخدمين</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">معرف المستخدم (User ID)</label>
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="أدخل معرف المستخدم"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <Button
            onClick={testPhoto}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            {loading ? "جاري الجلب..." : "جلب الصورة"}
          </Button>

          {error && <div className="text-red-400 text-center text-sm">{error}</div>}

          {photoUrl && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src={photoUrl || "/placeholder.svg"}
                  alt="User Photo"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <p className="text-green-400 text-sm">تم جلب الصورة بنجاح!</p>
              <p className="text-gray-400 text-xs mt-2 break-all">{photoUrl}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
