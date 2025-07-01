"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { setArtist } from "@/lib/utils/global"

const carouselData = [
  {
    id: 1,
    artist: "Leanne Graham",
    description: "Leanne Graham creates abstract murals with vibrant colors and dynamic patterns.",
    info: "Explore Leanne's latest urban artwork and bid on exclusive pieces in the upcoming auction.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    artist: "Ervin Howell",
    description: "Ervin Howell's stencil art portrays powerful street portraits with social commentary.",
    info: "Discover Ervin's unique street portraits and bid on his limited-edition pieces in our auction.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    artist: "Clementine Bauch",
    description: "Clementine Bauch's graffiti art features bold colors and geometric shapes.",
    info: "Check out Clementine's vibrant graffiti and bid on her stunning cityscape works in our auction.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function VisitorHomePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    setArtist(null)
  }, [])

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselData.length)
  }

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselData.length) % carouselData.length)
  }

  const handleFindItems = () => {
    router.push("/visitor/listing")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-[#A26A5E] leading-tight">
              Looking for
              <br />
              masterpiece?
            </h2>
          </div>
          <div>
            <Button onClick={handleFindItems} className="bg-[#A26A5E] hover:bg-[#8B5A4E] text-white px-8 py-3 text-lg">
              Find one now!
            </Button>
          </div>
        </div>

        {/* Images Slider */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {/* Left side images */}
            <div className="col-span-1 md:col-span-3 space-y-4">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Art 1"
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={handleFindItems}
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Art 2"
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={handleFindItems}
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Art 3"
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={handleFindItems}
              />
            </div>

            {/* Right side images */}
            <div className="col-span-1 md:col-span-3 space-y-4">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Art 4"
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={handleFindItems}
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Art 5"
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={handleFindItems}
              />
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Art 6"
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={handleFindItems}
              />
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevItem}
              className="text-[#A26A5E] hover:bg-[#A26A5E] hover:text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="flex-1 mx-8">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={carouselData[currentIndex].image || "/placeholder.svg"}
                      alt={carouselData[currentIndex].artist}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-gray-700 mb-4">{carouselData[currentIndex].description}</p>
                  <p className="text-gray-600">{carouselData[currentIndex].info}</p>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextItem}
              className="text-[#A26A5E] hover:bg-[#A26A5E] hover:text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
