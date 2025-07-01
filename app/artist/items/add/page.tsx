"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import { getItems, saveItems, itemTypes } from "@/lib/data"
import { getArtist } from "@/lib/utils/global"
import type { Item } from "@/types"

export default function AddItemPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    price: "",
    imageURL: "",
    isPublished: false,
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [itemId, setItemId] = useState<number | null>(null)
  const [capturedImage, setCapturedImage] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const currentArtist = getArtist()
    if (!currentArtist) {
      router.push("/")
      return
    }

    const editMode = localStorage.getItem("editMode") === "true"
    const storedItemId = localStorage.getItem("itemId")
    const storedCapturedImage = localStorage.getItem("capturedImage")

    if (storedCapturedImage) {
      setCapturedImage(storedCapturedImage)
    }

    if (editMode && storedItemId) {
      setIsEditMode(true)
      setItemId(Number.parseInt(storedItemId))

      const items = getItems()
      const itemToEdit = items.find((item) => item.id === Number.parseInt(storedItemId))

      if (itemToEdit) {
        setFormData({
          title: itemToEdit.title,
          description: itemToEdit.description,
          type: itemToEdit.type,
          price: itemToEdit.price.toString(),
          imageURL: itemToEdit.image,
          isPublished: itemToEdit.isPublished,
        })
      }
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.type || !formData.price) {
      alert("Please fill all required fields.")
      return
    }

    const currentArtist = getArtist()
    if (!currentArtist) return

    const allItems = getItems()
    const placeholderImage = "/placeholder.svg?height=300&width=400"

    const newItem: Item = {
      id: isEditMode && itemId ? itemId : generateNewId(allItems),
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      image: capturedImage || formData.imageURL.trim() || placeholderImage,
      price: Number.parseFloat(formData.price),
      artist: currentArtist,
      isPublished: formData.isPublished,
      dateCreated: isEditMode
        ? allItems.find((item) => item.id === itemId)?.dateCreated || new Date().toISOString()
        : new Date().toISOString(),
      isAuctioning: false,
    }

    let updatedItems
    if (isEditMode && itemId) {
      updatedItems = allItems.map((item) => (item.id === itemId ? { ...item, ...newItem } : item))
    } else {
      updatedItems = [...allItems, newItem]
    }

    saveItems(updatedItems)

    // Clean up localStorage
    localStorage.removeItem("editMode")
    localStorage.removeItem("itemId")
    localStorage.removeItem("capturedImage")

    router.push("/artist/items")
  }

  const handleCancel = () => {
    localStorage.removeItem("editMode")
    localStorage.removeItem("itemId")
    localStorage.removeItem("capturedImage")
    router.push("/artist/items")
  }

  const handleCaptureImage = () => {
    router.push("/artist/items/capture")
  }

  const generateNewId = (items: Item[]): number => {
    return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{isEditMode ? "Edit Item" : "Add New Item"}</span>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublished: checked as boolean }))}
              />
              <Label htmlFor="isPublished">Is Published</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="imageURL">Image URL</Label>
              <Input
                id="imageURL"
                type="url"
                value={formData.imageURL}
                onChange={(e) => setFormData((prev) => ({ ...prev, imageURL: e.target.value }))}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">or</p>
              <Button type="button" variant="outline" onClick={handleCaptureImage} className="w-full bg-transparent">
                <Camera className="w-4 h-4 mr-2" />
                Take a snapshot
              </Button>
              {capturedImage && (
                <div className="mt-4">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured"
                    className="w-32 h-32 object-cover mx-auto rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-[#A26A5E] hover:bg-[#8B5A4E]">
                {isEditMode ? "Update Item" : "Add New Item"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
