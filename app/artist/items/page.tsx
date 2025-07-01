"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye, EyeOff, Hammer } from "lucide-react"
import { getItems, saveItems } from "@/lib/data"
import { getArtist, setAuctionStatus } from "@/lib/utils/global"
import { formatDate, auctionTime, startTimer } from "@/lib/utils/dates"
import type { Item } from "@/types"

export default function ArtistItemsPage() {
  const [items, setItems] = useState<Item[]>([])
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
  }, [router])

  const handleAuction = (itemId: number) => {
    const allItems = getItems()
    const updatedItems = allItems.map((item) => {
      if (item.id === itemId) {
        if (!item.isAuctioning) {
          // End any other auctions first
          allItems.forEach((i) => (i.isAuctioning = false))
          localStorage.setItem("auctionTimer", auctionTime.toString())
          setAuctionStatus(true)
          startTimer(auctionTime)
        }
        return { ...item, isAuctioning: !item.isAuctioning }
      }
      return item
    })

    saveItems(updatedItems)
    const currentArtist = getArtist()
    setItems(updatedItems.filter((item) => item.artist === currentArtist))
  }

  const togglePublish = (itemId: number) => {
    const allItems = getItems()
    const updatedItems = allItems.map((item) =>
      item.id === itemId ? { ...item, isPublished: !item.isPublished } : item,
    )

    saveItems(updatedItems)
    const currentArtist = getArtist()
    setItems(updatedItems.filter((item) => item.artist === currentArtist))
  }

  const handleEdit = (itemId: number) => {
    localStorage.setItem("editMode", "true")
    localStorage.setItem("itemId", itemId.toString())
    router.push("/artist/items/add")
  }

  const handleRemove = (itemId: number) => {
    if (confirm("Are you sure you want to remove this item?")) {
      const allItems = getItems()
      const updatedItems = allItems.filter((item) => item.id !== itemId)
      saveItems(updatedItems)
      const currentArtist = getArtist()
      setItems(updatedItems.filter((item) => item.artist === currentArtist))
    }
  }

  const handleAddNew = () => {
    localStorage.removeItem("editMode")
    localStorage.removeItem("itemId")
    router.push("/artist/items/add")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#A26A5E]">My Items</h1>
        <Button onClick={handleAddNew} className="bg-[#A26A5E] hover:bg-[#8B5A4E]">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No items found.</p>
          <Button onClick={handleAddNew} className="bg-[#A26A5E] hover:bg-[#8B5A4E]">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500">{formatDate(item.dateCreated)}</p>
                  </div>
                  <p className="font-bold text-[#A26A5E]">${item.price}</p>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={item.isAuctioning ? "destructive" : "default"}
                    onClick={() => handleAuction(item.id)}
                    className="flex-1"
                  >
                    <Hammer className="w-4 h-4 mr-1" />
                    {item.isAuctioning ? "End Auction" : "Send to Auction"}
                  </Button>

                  <Button
                    size="sm"
                    variant={item.isPublished ? "outline" : "secondary"}
                    onClick={() => togglePublish(item.id)}
                  >
                    {item.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => handleEdit(item.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button size="sm" variant="destructive" onClick={() => handleRemove(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
