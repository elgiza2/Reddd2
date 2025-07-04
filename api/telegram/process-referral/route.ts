import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, referrerUsername } = await request.json()

    console.log(`Processing referral: User ${userId} referred by ${referrerUsername}`)

    // Load existing referrals
    const referrals = await loadReferrals()

    // Check if user already has a referrer
    const existingReferral = referrals.find((r: any) => r.userId === userId)
    if (existingReferral) {
      console.log(`User ${userId} already has a referrer`)
      return NextResponse.json({ success: false, message: "User already has a referrer" })
    }

    // Find referrer by username
    const referrer = await findUserByUsername(referrerUsername)
    if (!referrer) {
      console.log(`Referrer ${referrerUsername} not found`)
      return NextResponse.json({ success: false, message: "Referrer not found" })
    }

    // Add new referral
    const newReferral = {
      userId,
      referrerId: referrer.id,
      referrerUsername,
      createdAt: new Date().toISOString(),
      level: 1,
      bonusEarned: 0,
    }

    referrals.push(newReferral)

    // Save referrals
    await saveReferrals(referrals)

    // Update referrer's friend count
    await updateReferrerStats(referrer.id)

    console.log(`Referral processed successfully: ${userId} -> ${referrerUsername}`)

    return NextResponse.json({
      success: true,
      message: "Referral processed successfully",
      referral: newReferral,
    })
  } catch (error) {
    console.error("Error processing referral:", error)
    return NextResponse.json({ success: false, error: "Failed to process referral" }, { status: 500 })
  }
}

async function loadReferrals() {
  try {
    if (typeof window === "undefined") {
      const fs = require("fs").promises
      const path = require("path")
      const referralsPath = path.join(process.cwd(), "referrals.json")

      try {
        const data = await fs.readFile(referralsPath, "utf8")
        return JSON.parse(data)
      } catch (error) {
        // File doesn't exist, return empty array
        return []
      }
    }
    return []
  } catch (error) {
    console.error("Error loading referrals:", error)
    return []
  }
}

async function saveReferrals(referrals: any[]) {
  try {
    if (typeof window === "undefined") {
      const fs = require("fs").promises
      const path = require("path")
      const referralsPath = path.join(process.cwd(), "referrals.json")

      await fs.writeFile(referralsPath, JSON.stringify(referrals, null, 2))
    }
  } catch (error) {
    console.error("Error saving referrals:", error)
  }
}

async function findUserByUsername(username: string) {
  try {
    if (typeof window === "undefined") {
      const fs = require("fs").promises
      const path = require("path")
      const usersPath = path.join(process.cwd(), "users.json")

      try {
        const data = await fs.readFile(usersPath, "utf8")
        const users = JSON.parse(data)
        return users.find((u: any) => u.username === username)
      } catch (error) {
        // File doesn't exist or user not found
        return null
      }
    }
    return null
  } catch (error) {
    console.error("Error finding user by username:", error)
    return null
  }
}

async function updateReferrerStats(referrerId: number) {
  try {
    if (typeof window === "undefined") {
      const fs = require("fs").promises
      const path = require("path")
      const statsPath = path.join(process.cwd(), "referrer-stats.json")

      let stats: Record<string, any> = {}
      try {
        const data = await fs.readFile(statsPath, "utf8")
        stats = JSON.parse(data)
      } catch (error) {
        // File doesn't exist, start with empty object
      }

      if (!stats[referrerId]) {
        stats[referrerId] = {
          friendsCount: 0,
          totalEarnings: 0,
          level1Count: 0,
          level2Count: 0,
          level3Count: 0,
        }
      }

      stats[referrerId].friendsCount += 1
      stats[referrerId].level1Count += 1

      await fs.writeFile(statsPath, JSON.stringify(stats, null, 2))
    }
  } catch (error) {
    console.error("Error updating referrer stats:", error)
  }
}
