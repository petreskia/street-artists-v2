"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getItems } from "@/lib/data"
import { getArtist, getCurrentBid, updateCurrentBid } from "@/lib/utils/global"
import { auctionTime } from "@/lib/utils/dates"
import type { Item } from "@/types"

export default function AuctionPage() {
  const [auctionItem, setAuctionItem] = useState<Item | null>(null)
  const [currentBid, setCurrentBid] = useState(0)
  const [bidAmount, setBidAmount] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(auctionTime)
  const [isArtist, setIsArtist] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const items = getItems()
    const item = items.find((item) => item.isAuctioning)

    if (!item) {
      router.push("/")
      return
    }

    setAuctionItem(item)
    const storedBid = getCurrentBid()
    const initialBid = storedBid || item.price / 2
    setCurrentBid(initialBid)

    const currentArtist = getArtist()
    setIsArtist(!!currentArtist)

    // Timer
    const storedTime = localStorage.getItem("auctionTimer")
    const initialTime = storedTime ? Number.parseInt(storedTime) : auctionTime
    setTimeRemaining(initialTime)

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1
        localStorage.setItem("auctionTimer", newTime.toString())

        if (newTime <= 0) {
          clearInterval(timer)
          endAuction()
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const endAuction = () => {
    localStorage.removeItem("auctionTimer")
    localStorage.setItem("auctionOngoing", "false")
    alert("Auction has ended!")
    router.push("/")
  }

  const placeBid = async () => {
    const bidValue = Number.parseFloat(bidAmount)

    if (isArtist) {
      alert("Artists cannot bid in auctions.")
      return
    }

    if (bidValue <= currentBid) {
      alert("Your bid must be higher than the current bid.")
      return
    }

    try {
      const response = await fetch("https://projects.brainster.tech/bidding/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `amount=${bidValue}`,
      })

      const result = await response.json()

      if (result.isBidding) {
        const newBid = result.bidAmount
        setCurrentBid(newBid)
        updateCurrentBid(newBid)
        setTimeRemaining(auctionTime) // Reset timer
        localStorage.setItem("auctionTimer", auctionTime.toString())
        setBidAmount("")
      } else {
        alert("No other bids were placed. Please wait until the timer ends.")
        endAuction()
      }
    } catch (error) {
      console.error("Error placing bid:", error)
      alert("Error placing bid. Please try again.")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!auctionItem) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>No auction currently running.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            <h1 className="text-3xl font-bold text-[#A26A5E] mb-2">Auction for:</h1>
            <h2 className="text-4xl font-bold text-[#A26A5E]">{auctionItem.title}</h2>
            <p className="text-xl text-gray-600 mt-2">by {auctionItem.artist}</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image */}
            <div className="lg:w-1/2">
              <img
                src={auctionItem.image || "/placeholder.svg"}
                alt={auctionItem.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Auction Details */}
            <div className="lg:w-1/2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{auctionItem.description}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Current Bid</h3>
                <p className="text-3xl font-bold text-green-600">${currentBid}</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Time Remaining</h3>
                <p className="text-2xl font-bold text-red-600">{formatTime(timeRemaining)}</p>
              </div>

              {!isArtist && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="bidAmount" className="block text-sm font-medium mb-2">
                      Your Bid Amount
                    </label>
                    <Input
                      id="bidAmount"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Enter amount higher than $${currentBid}`}
                      min={currentBid + 1}
                    />
                  </div>
                  <Button
                    onClick={placeBid}
                    className="w-full bg-[#A26A5E] hover:bg-[#8B5A4E] text-white py-3 text-lg"
                    disabled={!bidAmount || Number.parseFloat(bidAmount) <= currentBid}
                  >
                    Place Bid
                  </Button>
                </div>
              )}

              {isArtist && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800">Artists cannot participate in bidding.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
