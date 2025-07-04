import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN is not set")
      return NextResponse.json({ error: "Bot token not configured" }, { status: 500 })
    }

    console.log(`Fetching photo for user ID: ${userId}`)

    // Get user profile photos
    const photosResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`,
    )

    if (!photosResponse.ok) {
      console.error("Failed to fetch user profile photos:", photosResponse.status)
      return NextResponse.json({ error: "Failed to fetch user photos" }, { status: 400 })
    }

    const photosData = await photosResponse.json()
    console.log("Photos response:", JSON.stringify(photosData, null, 2))

    if (!photosData.ok || !photosData.result.photos || photosData.result.photos.length === 0) {
      console.log("No profile photos found for user")
      return NextResponse.json({ photo_url: null })
    }

    // Get the highest resolution photo
    const photo = photosData.result.photos[0]
    const highestResPhoto = photo[photo.length - 1] // Last element has highest resolution
    const fileId = highestResPhoto.file_id

    console.log(`Getting file info for file_id: ${fileId}`)

    // Get file path
    const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`)

    if (!fileResponse.ok) {
      console.error("Failed to get file info:", fileResponse.status)
      return NextResponse.json({ error: "Failed to get file info" }, { status: 400 })
    }

    const fileData = await fileResponse.json()
    console.log("File response:", JSON.stringify(fileData, null, 2))

    if (!fileData.ok || !fileData.result.file_path) {
      console.error("Invalid file response")
      return NextResponse.json({ error: "Invalid file response" }, { status: 400 })
    }

    // Construct the photo URL
    const photoUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
    console.log(`Photo URL: ${photoUrl}`)

    return NextResponse.json({ photo_url: photoUrl })
  } catch (error) {
    console.error("Error fetching user photo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
