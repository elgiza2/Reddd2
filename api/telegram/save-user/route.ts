import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { user, referrer } = await request.json()

    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("telegram_id", user.id).single()

    if (existingUser) {
      // Update existing user
      const { error: updateError } = await supabase
        .from("users")
        .update({
          first_name: user.first_name,
          last_name: user.last_name || null,
          username: user.username || null,
          photo_url: user.photo_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("telegram_id", user.id)

      if (updateError) {
        console.error("Error updating user:", updateError)
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
      }

      return NextResponse.json({ success: true, isNewUser: false })
    }

    // Create new user
    const { error: insertError } = await supabase.from("users").insert({
      telegram_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || null,
      username: user.username || null,
      photo_url: user.photo_url || null,
      balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error creating user:", insertError)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Process referral if exists
    if (referrer) {
      try {
        const { data: referrerUser } = await supabase.from("users").select("*").eq("username", referrer).single()

        if (referrerUser) {
          // Create referral record
          await supabase.from("referrals").insert({
            referrer_id: referrerUser.telegram_id,
            referred_id: user.id,
            created_at: new Date().toISOString(),
          })

          // Update referrer's balance (bonus for referral)
          await supabase
            .from("users")
            .update({
              balance: referrerUser.balance + 10, // 10 TON bonus for referral
            })
            .eq("telegram_id", referrerUser.telegram_id)

          console.log(`Referral processed: ${referrer} referred ${user.username || user.first_name}`)
        }
      } catch (referralError) {
        console.error("Error processing referral:", referralError)
        // Don't fail the user creation if referral processing fails
      }
    }

    return NextResponse.json({ success: true, isNewUser: true })
  } catch (error) {
    console.error("Error in save-user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
