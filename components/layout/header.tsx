"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, Hammer } from "lucide-react"
import { getArtist, getUserRole } from "@/lib/utils/global"

export function Header() {
  const [currentArtist, setCurrentArtist] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const pathname = usePathname()
  const userRole = getUserRole()

  useEffect(() => {
    setCurrentArtist(getArtist())
  }, [pathname])

  const isLandingPage = pathname === "/"
  const isArtist = userRole === "artist"
  const isVisitor = userRole === "visitor"

  if (isLandingPage) {
    return (
      <header className="flex items-center justify-center p-6">
        <h1 className="text-4xl font-bold text-[#A26A5E]">StreetARTists</h1>
      </header>
    )
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      {/* Logo */}
      {(isArtist || isVisitor) && (
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 bg-[#A26A5E] rounded flex items-center justify-center">
            <span className="text-white font-bold">SA</span>
          </div>
        </Link>
      )}

      {/* Title or Artist Name */}
      <div className="flex-1 text-center">
        {isArtist && currentArtist ? (
          <h1 className="text-2xl font-bold text-[#A26A5E]">{currentArtist}</h1>
        ) : (
          <h1 className="text-2xl font-bold text-[#A26A5E]">StreetARTists</h1>
        )}
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Auction Button */}
        {(isArtist || isVisitor) && (
          <Link href="/auction">
            <Button variant="ghost" size="icon" className="text-[#A26A5E]">
              <Hammer className="h-6 w-6" />
            </Button>
          </Link>
        )}

        {/* Hamburger Menu for Artists */}
        {isArtist && (
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)} className="text-[#A26A5E]">
              <Menu className="h-6 w-6" />
            </Button>

            {showMenu && (
              <nav className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 min-w-[150px] z-50">
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/artist"
                      className="block px-3 py-2 text-[#A26A5E] hover:bg-gray-100 rounded"
                      onClick={() => setShowMenu(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/artist/items"
                      className="block px-3 py-2 text-[#A26A5E] hover:bg-gray-100 rounded"
                      onClick={() => setShowMenu(false)}
                    >
                      Items
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auction"
                      className="block px-3 py-2 text-[#A26A5E] hover:bg-gray-100 rounded"
                      onClick={() => setShowMenu(false)}
                    >
                      Auction
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
