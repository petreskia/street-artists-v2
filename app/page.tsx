"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { setArtist } from "@/lib/utils/global"

interface Artist {
  id: number
  name: string
}

export default function LandingPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [selectedArtist, setSelectedArtist] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users")
      const data = await response.json()
      setArtists(data)
    } catch (error) {
      console.error("Failed to fetch artists:", error)
    }
  }

  const handleArtistSelect = (artistName: string) => {
    setSelectedArtist(artistName)
    setArtist(artistName)
    router.push("/artist")
  }

  const handleVisitorClick = () => {
    setArtist(null)
    router.push("/visitor")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-32 h-32 bg-[#A26A5E] rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-4xl font-bold">SA</span>
        </div>
      </div>

      {/* Join Section */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Artist Card */}
        <Card className="flex-1 cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-[#A26A5E] mb-6">Join as Artist</h2>
            <Select onValueChange={handleArtistSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an artist" />
              </SelectTrigger>
              <SelectContent>
                {artists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.name}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Visitor Card */}
        <Card className="flex-1 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleVisitorClick}>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-[#A26A5E] mb-6">Join as Visitor</h2>
            <Button className="w-full bg-[#A26A5E] hover:bg-[#8B5A4E] text-white">Enter as Visitor</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
