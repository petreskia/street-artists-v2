"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Share2, ShoppingCart, Calendar } from "lucide-react";
import { getItems } from "@/lib/data";
import type { Item } from "@/types";
import Link from "next/link";

export default function ArtworkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [artwork, setArtwork] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const items = getItems();
    const found = items.find((item) => item.id === Number.parseInt(params.id));
    setArtwork(found || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#A26A5E]" />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent>
            <p className="text-gray-500 text-center mb-4">Artwork not found</p>
            <Link href="/explore">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Gallery
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork.title,
          text: `Check out "${artwork.title}" by ${artwork.artist}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/explore"
          className="inline-flex items-center text-[#A26A5E] hover:text-[#8B5A4E] mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card className="overflow-hidden">
              <img
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                className="w-full h-auto object-cover"
              />
            </Card>
          </div>

          <div>
            <Badge className="mb-4">{artwork.type}</Badge>
            <h1 className="text-4xl font-bold mb-2">{artwork.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              by {artwork.artist}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(artwork.dateCreated).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-4xl font-bold text-[#A26A5E] mb-2">
                ${artwork.price.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                One-time purchase
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <Button className="w-full bg-[#A26A5E] hover:bg-[#8B5A4E] text-lg py-6">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Purchase Artwork
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full bg-transparent">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {artwork.description}
                </p>
              </CardContent>
            </Card>

            {artwork.isAuctioning && (
              <Card className="mt-6 bg-gradient-to-r from-[#A26A5E] to-[#8B5A4E] text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-semibold">LIVE AUCTION</span>
                  </div>
                  <p className="mb-4">
                    This artwork is currently in a live auction!
                  </p>
                  <Link href="/auction">
                    <Button variant="secondary" className="w-full">
                      View Auction
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
