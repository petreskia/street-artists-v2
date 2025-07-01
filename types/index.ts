export interface Artist {
  id: number
  name: string
}

export interface Item {
  id: number
  title: string
  description: string
  type: string
  image: string
  price: number
  artist: string
  isPublished: boolean
  dateCreated: string
  isAuctioning: boolean
  dateSold?: string
  priceSold?: number
}

export interface AuctionState {
  isOngoing: boolean
  currentBid: number
  timeRemaining: number
}

export type UserRole = "artist" | "visitor" | null
