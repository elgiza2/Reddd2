import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = Number.parseInt(params.userId)

    // Load referrer stats
    const stats = await loadReferrerStats(userId)

    // Load user's referrals
    const referrals = await loadUserReferrals(userId)

    return NextResponse.json({
      success: true,
      stats: stats || {
        friendsCount: 0,
        totalEarnings: 0,
        level1Count: 0,
        level2Count: 0,
        level3Count: 0,
      },
      referrals,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user stats" }, { status: 500 })
  }
}

async function loadReferrerStats(userId: number) {
  try {
    if (typeof window === "undefined") {
      const fs = require("fs").promises
      const path = require("path")
      const statsPath = path.join(process.cwd(), "referrer-stats.json")

      try {
        const data = await fs.readFile(statsPath, "utf8")
        const stats = JSON.parse(data)
        return stats[userId.toString()]
      } catch (error) {
        return null
      }
    }
    return null
  } catch (error) {
    console.error("Error loading referrer stats:", error)
    return null
  }
}

async function loadUserReferrals(userId: number) {
  try {
    if (typeof window === "undefined") {
      const fs = require("fs").promises
      const path = require("path")
      const referralsPath = path.join(process.cwd(), "referrals.json")

      try {
        const data = await fs.readFile(referralsPath, "utf8")
        const referrals = JSON.parse(data)
        return referrals.filter((r: any) => r.referrerId === userId)
      } catch (error) {
        return []
      }
    }
    return []
  } catch (error) {
    console.error("Error loading user referrals:", error)
    return []
  }
}
