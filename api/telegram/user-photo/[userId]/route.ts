import { type NextRequest, NextResponse } from "next/server"

// This API route fetches user profile photos from Telegram
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      console.log("No Telegram bot token provided")
      return NextResponse.json({ photo_url: null }, { status: 200 })
    }

    // Get user profile photos from Telegram Bot API
    const photosResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!photosResponse.ok) {
      console.log(`Failed to fetch user photos: ${photosResponse.status}`)
      return NextResponse.json({ photo_url: null }, { status: 200 })
    }

    const photosData = await photosResponse.json()

    if (!photosData.ok || !photosData.result.photos || photosData.result.photos.length === 0) {
      console.log("No profile photos found for user")
      return NextResponse.json({ photo_url: null }, { status: 200 })
    }

    // Get the first (most recent) photo
    const photo = photosData.result.photos[0]

    // Get the largest size available (last item in the array)
    const largestPhoto = photo[photo.length - 1]

    // Get file information to construct download URL
    const fileResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${largestPhoto.file_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!fileResponse.ok) {
      console.log(`Failed to get file info: ${fileResponse.status}`)
      return NextResponse.json({ photo_url: null }, { status: 200 })
    }

    const fileData = await fileResponse.json()

    if (!fileData.ok || !fileData.result.file_path) {
      console.log("Failed to get file path")
      return NextResponse.json({ photo_url: null }, { status: 200 })
    }

    // Construct the full photo URL
    const photoUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`

    console.log(`Successfully fetched photo for user ${userId}`)
    return NextResponse.json(
      {
        photo_url: photoUrl,
        file_size: fileData.result.file_size,
        width: largestPhoto.width,
        height: largestPhoto.height,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching user photo:", error)
    return NextResponse.json(
      {
        photo_url: null,
        error: "Failed to fetch user photo",
      },
      { status: 200 },
    )
  }
}
