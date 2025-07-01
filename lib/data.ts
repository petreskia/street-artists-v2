import type { Item } from "@/types"

export const itemTypes = ["Mural", "Graffiti", "Stencil Art", "Street Sculpture", "Poster Art", "Digital Art"]

export const defaultItems: Item[] = [
  {
    id: 1,
    title: "Urban Dreams",
    description: "A vibrant mural depicting city life",
    type: "Mural",
    image: "/placeholder.svg?height=300&width=400",
    price: 1200,
    artist: "Leanne Graham",
    isPublished: true,
    dateCreated: new Date().toISOString(),
    isAuctioning: false,
  },
  {
    id: 2,
    title: "Street Portrait",
    description: "Powerful portrait with social commentary",
    type: "Stencil Art",
    image: "/placeholder.svg?height=300&width=400",
    price: 800,
    artist: "Ervin Howell",
    isPublished: true,
    dateCreated: new Date().toISOString(),
    isAuctioning: false,
  },
  {
    id: 3,
    title: "Geometric Flow",
    description: "Bold geometric shapes in vibrant colors",
    type: "Graffiti",
    image: "/placeholder.svg?height=300&width=400",
    price: 950,
    artist: "Clementine Bauch",
    isPublished: true,
    dateCreated: new Date().toISOString(),
    isAuctioning: false,
  },
]

export function getItems(): Item[] {
  if (typeof window === "undefined") return defaultItems

  const stored = localStorage.getItem("items")
  return stored ? JSON.parse(stored) : defaultItems
}

export function saveItems(items: Item[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("items", JSON.stringify(items))
}
