"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
  status: "pending" | "accepted" | "rejected"
  sender: User
}

const FriendsPage = () => {
  const { data: session, status } = useSession()
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [referralCode, setReferralCode] = useState("")
  const [generatedReferralCode, setGeneratedReferralCode] = useState("")
  const [referralLink, setReferralLink] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (session?.user?.id) {
        setIsLoading(true)
        try {
          const response = await fetch("/api/friends")
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          setFriendRequests(data)
        } catch (error) {
          console.error("Failed to fetch friend requests:", error)
          toast({
            title: "Error fetching friend requests",
            description: "Please try again later.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchFriendRequests()
  }, [session?.user?.id, toast])

  useEffect(() => {
    if (session?.user?.id) {
      setGeneratedReferralCode(session.user.id)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (generatedReferralCode) {
      setReferralLink(`${window.location.origin}/register?referral=${generatedReferralCode}`)
    }
  }, [generatedReferralCode])

  const handleAccept = async (friendRequestId: string) => {
    try {
      const response = await fetch(`/api/friends/${friendRequestId}/accept`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setFriendRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === friendRequestId ? { ...req, status: "accepted" } : req)),
      )
      toast({
        title: "Friend request accepted!",
      })
    } catch (error) {
      console.error("Failed to accept friend request:", error)
      toast({
        title: "Error accepting friend request",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (friendRequestId: string) => {
    try {
      const response = await fetch(`/api/friends/${friendRequestId}/reject`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setFriendRequests((prevRequests) =>
        prevRequests.map((req) => (req.id === friendRequestId ? { ...req, status: "rejected" } : req)),
      )
      toast({
        title: "Friend request rejected",
      })
    } catch (error) {
      console.error("Failed to reject friend request:", error)
      toast({
        title: "Error rejecting friend request",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleAddFriend = async () => {
    if (!referralCode) {
      toast({
        title: "Error",
        description: "Please enter a referral code.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/friends/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referralCode }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Friend request sent!",
      })
      router.refresh() // Refresh the route to update the friend requests
    } catch (error: any) {
      console.error("Failed to add friend:", error)
      toast({
        title: "Error adding friend",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Friends</h1>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-64" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-64" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Friends</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Friend</CardTitle>
          <CardDescription>Enter your friend's referral code to send a friend request.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="referralCode" className="text-right">
              Referral Code
            </Label>
            <Input
              id="referralCode"
              className="col-span-3"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>
          <Button onClick={handleAddFriend}>Add Friend</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link with your friends to earn rewards!</CardDescription>
        </CardHeader>
        <CardContent>
          <Input type="text" value={referralLink} readOnly />
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Friend Requests</h2>
      {friendRequests.length === 0 ? (
        <p>No friend requests.</p>
      ) : (
        <div className="grid gap-4">
          {friendRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={request.sender.image || ""} />
                    <AvatarFallback>{request.sender.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{request.sender.name}</CardTitle>
                    <CardDescription>
                      {request.status === "pending"
                        ? "Pending"
                        : request.status === "accepted"
                          ? "Accepted"
                          : "Rejected"}
                    </CardDescription>
                  </div>
                </div>
                {request.status === "pending" && (
                  <div>
                    <Button size="sm" variant="outline" onClick={() => handleAccept(request.id)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                      Reject
                    </Button>
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default FriendsPage
