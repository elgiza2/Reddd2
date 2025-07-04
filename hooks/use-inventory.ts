"use client"

import { useState, useEffect } from "react"
import type { InventoryItem, UserInventory } from "@/types/inventory"

export function useInventory() {
  const [inventory, setInventory] = useState<UserInventory>({
    available: [],
    withdrawn: [],
    sold: [],
  })

  useEffect(() => {
    // Load inventory from localStorage
    const savedInventory = localStorage.getItem("userInventory")
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    }
  }, [])

  const saveInventory = (newInventory: UserInventory) => {
    setInventory(newInventory)
    localStorage.setItem("userInventory", JSON.stringify(newInventory))
  }

  const addItem = (item: Omit<InventoryItem, "id" | "dateWon">, caseId: string, caseName: string) => {
    const newItem: InventoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      dateWon: Date.now(),
      caseId,
      caseName,
    }

    const newInventory = {
      ...inventory,
      available: [...inventory.available, newItem],
    }
    saveInventory(newInventory)
    return newItem
  }

  const sellItem = (itemId: string) => {
    const item = inventory.available.find((i) => i.id === itemId)
    if (!item) return false

    const newInventory = {
      ...inventory,
      available: inventory.available.filter((i) => i.id !== itemId),
      sold: [...inventory.sold, { ...item, dateSold: Date.now() }],
    }
    saveInventory(newInventory)

    // Add value to user balance
    const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "0")
    const newBalance = currentBalance + item.value
    localStorage.setItem("userBalance", newBalance.toString())

    return true
  }

  const withdrawItem = (itemId: string) => {
    const item = inventory.available.find((i) => i.id === itemId)
    if (!item) return false

    const newInventory = {
      ...inventory,
      available: inventory.available.filter((i) => i.id !== itemId),
      withdrawn: [...inventory.withdrawn, { ...item, dateWithdrawn: Date.now() }],
    }
    saveInventory(newInventory)
    return true
  }

  return {
    inventory,
    addItem,
    sellItem,
    withdrawItem,
  }
}
