"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Filter, X, Check, RotateCcw } from "lucide-react"
import { getItems, itemTypes } from "@/lib/data"
import type { Item } from "@/types"

export default function VisitorListingPage() {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    title: "",
    artist: "",
    minPrice: "",
    maxPrice: "",
    type: "",
  })

  useEffect(() => {
    const allItems = getItems()
    const publishedItems = allItems.filter((item) => item.isPublished)
    setItems(publishedItems)
    setFilteredItems(publishedItems)
  }, [])

  const uniqueArtists = [...new Set(items.map((item) => item.artist))]

  const applyFilters = () => {
    const filtered = items.filter((item) => {
      const matchesTitle = !filters.title || item.title.toLowerCase().includes(filters.title.toLowerCase())

      const matchesArtist = !filters.artist || item.artist === filters.artist

      const matchesMinPrice = !filters.minPrice || item.price >= Number.parseFloat(filters.minPrice)

      const matchesMaxPrice = !filters.maxPrice || item.price <= Number.parseFloat(filters.maxPrice)

      const matchesType = !filters.type || item.type === filters.type

      return matchesTitle && matchesArtist && matchesMinPrice && matchesMaxPrice && matchesType
    })

    setFilteredItems(filtered)
    setShowFilters(false)
  }

  const resetFilters = () => {
    setFilters({
      title: "",
      artist: "",
      minPrice: "",
      maxPrice: "",
      type: "",
    })
    setFilteredItems(items)
  }

  return (
    <div className="container mx-auto p-6">
      {/* Filter Button */}
      <div className="mb-6">
        <Button
          onClick={() => setShowFilters(true)}
          className="bg-[#D54C2E] hover:bg-[#B8412A] text-white shadow-lg"
          size="lg"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </Button>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className={`p-4 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-[#A26A5E] text-lg">{item.artist}</h3>
                  <p className="font-bold text-lg">${item.price}</p>
                </div>
                <h4 className="font-semibold text-xl mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#A26A5E]">Filter by</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="titleFilter">By Item Title</Label>
                <Input
                  id="titleFilter"
                  value={filters.title}
                  onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Search by title..."
                />
              </div>

              <div>
                <Label htmlFor="artistFilter">By Artist</Label>
                <Select
                  value={filters.artist}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, artist: value === "all" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose artist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Artists</SelectItem>
                    {uniqueArtists.map((artist) => (
                      <SelectItem key={artist} value={artist}>
                        {artist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>By Price</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="minPrice" className="text-sm">
                      Min:
                    </Label>
                    <Input
                      id="minPrice"
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="maxPrice" className="text-sm">
                      Max:
                    </Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                      placeholder="∞"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="typeFilter">By Type</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value === "all" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {itemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={applyFilters} className="flex-1 bg-[#D54C2E] hover:bg-[#B8412A] text-white">
                <Check className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              <Button onClick={resetFilters} variant="outline" className="flex-1 bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
