"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { getItems } from "@/lib/data"
import { getArtist, isAuctionOngoingStatus, getCurrentBid } from "@/lib/utils/global"
import { generateDateLabels, formatDate } from "@/lib/utils/dates"
import { useRouter } from "next/navigation"
import type { Item } from "@/types"

export default function ArtistHomePage() {
  const [items, setItems] = useState<Item[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState(7)
  const [stats, setStats] = useState({
    totalItems: 0,
    soldItems: 0,
    totalIncome: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const currentArtist = getArtist()
    if (!currentArtist) {
      router.push("/")
      return
    }

    const allItems = getItems()
    const artistItems = allItems.filter((item) => item.artist === currentArtist)
    setItems(artistItems)

    // Calculate stats
    const soldItems = artistItems.filter((item) => item.dateSold).length
    const totalIncome = artistItems.reduce((sum, item) => {
      return item.dateSold ? sum + (item.priceSold || 0) : sum
    }, 0)

    setStats({
      totalItems: artistItems.length,
      soldItems,
      totalIncome,
    })

    updateChart(artistItems, selectedPeriod)
  }, [selectedPeriod, router])

  const updateChart = (artistItems: Item[], days: number) => {
    const labels = generateDateLabels(days)
    const data = labels.map((label) => {
      const income = artistItems.reduce((sum, item) => {
        return formatDate(item.dateSold || "") === label ? sum + (item.priceSold || 0) : sum
      }, 0)
      return { date: label, income }
    })
    setChartData(data)
  }

  const auctionItem = items.find((item) => item.isAuctioning)
  const isAuctionOngoing = isAuctionOngoingStatus()
  const currentBid = getCurrentBid()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.soldItems}/{stats.totalItems}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalIncome}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${isAuctionOngoing ? "hover:shadow-lg" : ""}`}
          onClick={() => isAuctionOngoing && router.push("/auction")}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Live Auctioning Item</CardTitle>
          </CardHeader>
          <CardContent>
            {isAuctionOngoing && auctionItem ? (
              <>
                <div className="text-lg font-semibold">{auctionItem.title}</div>
                <div className="text-2xl font-bold text-green-600">${currentBid || auctionItem.price / 2}</div>
                <div className="text-sm text-gray-500">current bid</div>
              </>
            ) : (
              <div className="text-gray-500">No auctioning item</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Income Chart</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 7 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(7)}
            >
              7 days
            </Button>
            <Button
              variant={selectedPeriod === 14 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(14)}
            >
              14 days
            </Button>
            <Button
              variant={selectedPeriod === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(30)}
            >
              30 days
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              income: {
                label: "Income",
                color: "#A26A5E",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="horizontal">
                <XAxis type="number" />
                <YAxis dataKey="date" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill="#A26A5E" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
