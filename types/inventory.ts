export interface InventoryItem {
  id: string
  name: string
  image: string
  value: number
  dateWon: number
  caseId: string
  caseName: string
}

export interface UserInventory {
  available: InventoryItem[]
  withdrawn: InventoryItem[]
  sold: InventoryItem[]
}
