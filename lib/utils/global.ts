import type { UserRole } from "@/types"

export function getArtist(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("currentArtist")
}

export function setArtist(artist: string | null): void {
  if (typeof window === "undefined") return

  if (artist) {
    localStorage.setItem("currentArtist", artist)
  } else {
    localStorage.removeItem("currentArtist")
  }
}

export function getUserRole(): UserRole {
  if (typeof window === "undefined") return null
  const artist = getArtist()
  return artist ? "artist" : "visitor"
}

export function getCurrentBid(): number {
  if (typeof window === "undefined") return 0
  const bid = localStorage.getItem("currentBid")
  return bid ? Number.parseFloat(bid) : 0
}

export function updateCurrentBid(amount: number): void {
  if (typeof window === "undefined") return
  localStorage.setItem("currentBid", amount.toString())
}

export function isAuctionOngoingStatus(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("auctionOngoing") === "true"
}

export function setAuctionStatus(status: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem("auctionOngoing", status.toString())
}
