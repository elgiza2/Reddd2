"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

import { useStore } from "@/store/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const DepositPage = () => {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const increaseBalance = useStore((state) => state.increaseBalance)

  const handleDeposit = async (paymentMethod: "card" | "paypal") => {
    setIsLoading(true)
    try {
      const depositAmount = Number.parseFloat(amount)

      if (isNaN(depositAmount) || depositAmount <= 0) {
        toast.error("Please enter a valid amount to deposit.")
        return
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      increaseBalance(depositAmount)
      toast.success(`Successfully deposited $${depositAmount} via ${paymentMethod}!`)
      router.push("/account")
    } catch (error) {
      console.error("Deposit failed:", error)
      toast.error("Failed to process deposit. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center h-screen">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Deposit Funds</CardTitle>
          <CardDescription>Add funds to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount to Deposit</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button
              disabled={isLoading}
              onClick={() => handleDeposit("card")}
              className={cn(isLoading && "cursor-not-allowed")}
            >
              {isLoading ? "Processing..." : "Deposit with Card"}
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => handleDeposit("paypal")}
              variant="secondary"
              className={cn(isLoading && "cursor-not-allowed")}
            >
              {isLoading ? "Processing..." : "Deposit with PayPal"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DepositPage
