"use client";

import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import type { Artwork } from "@/types";
import { useState } from "react";

interface TopArtworksProps {
  artworks: Artwork[];
}

export function TopArtworks({ artworks }: TopArtworksProps) {
  const router = useRouter();
  const { currentUser, toggleFavoriteArtwork } = useApp();
  const [shareArtworkId, setShareArtworkId] = useState<string | null>(null);

  const isLiked = (artworkId: string) => {
    return currentUser?.likedArtworks.includes(artworkId) || false;
  };

  const handleShare = async (artwork: Artwork, e: React.MouseEvent) => {
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork.title,
          text: `Check out this amazing artwork by ${artwork.artistName}`,
          url: `${window.location.origin}/artwork/${artwork.id}`,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/artwork/${artwork.id}`
      );
      setShareArtworkId(artwork.id);
      setTimeout(() => setShareArtworkId(null), 2000);
    }
  };

  return (
    <section className="py-20 px-6 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Top Artworks
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Most viewed and loved pieces by our community
            </p>
          </div>
          <Button
            onClick={() => router.push("/artworks")}
            variant="outline"
            className="hidden md:block"
          >
            Explore All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <Card
              key={artwork.id}
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => router.push(`/artwork/${artwork.id}`)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={artwork.image || "/placeholder.svg"}
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteArtwork(artwork.id);
                    }}
                    className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked(artwork.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-700"
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => handleShare(artwork, e)}
                    className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors relative"
                  >
                    <Share2 className="w-4 h-4 text-gray-700" />
                    {shareArtworkId === artwork.id && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Link copied!
                      </span>
                    )}
                  </button>
                </div>

                {/* Stats overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-3 text-white text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{artwork.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{artwork.likes}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
                  {artwork.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  by {artwork.artistName}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#A26A5E] font-bold text-lg">
                    ${artwork.price}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                    {artwork.type}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button onClick={() => router.push("/artworks")}>Explore All</Button>
        </div>
      </div>
    </section>
  );
}
