import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json(
        {
          user: {
            id: Number.parseInt(userId),
            first_name: "User",
            username: `user${userId}`,
            photo_url: null,
          },
        },
        { status: 200 },
      )
    }

    // Get user info from Telegram
    const userResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${userId}`)

    if (!userResponse.ok) {
      return NextResponse.json(
        {
          user: {
            id: Number.parseInt(userId),
            first_name: "User",
            username: `user${userId}`,
            photo_url: null,
          },
        },
        { status: 200 },
      )
    }

    const userData = await userResponse.json()

    if (!userData.ok) {
      return NextResponse.json(
        {
          user: {
            id: Number.parseInt(userId),
            first_name: "User",
            username: `user${userId}`,
            photo_url: null,
          },
        },
        { status: 200 },
      )
    }

    const user = userData.result
    let photoUrl = null

    // Try to get user photo
    try {
      const photosResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`,
      )

      if (photosResponse.ok) {
        const photosData = await photosResponse.json()

        if (photosData.ok && photosData.result.photos.length > 0) {
          const photo = photosData.result.photos[0]
          const largestPhoto = photo[photo.length - 1]

          const fileResponse = await fetch(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${largestPhoto.file_id}`,
          )

          if (fileResponse.ok) {
            const fileData = await fileResponse.json()
            if (fileData.ok) {
              photoUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
            }
          }
        }
      }
    } catch (photoError) {
      console.log("Could not fetch user photo:", photoError)
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          first_name: user.first_name || "User",
          last_name: user.last_name,
          username: user.username,
          photo_url: photoUrl,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching user info:", error)
    return NextResponse.json(
      {
        user: {
          id: Number.parseInt(userId),
          first_name: "User",
          username: `user${userId}`,
          photo_url: null,
        },
      },
      { status: 200 },
    )
  }
}
