"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hammer, Clock, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Auction } from "@/types";
import { useApp } from "@/context/app-context";

interface AuctionWidgetProps {
  auction: Auction;
}

export function AuctionWidget({ auction }: AuctionWidgetProps) {
  const router = useRouter();
  const { artworks } = useApp();
  const [timeLeft, setTimeLeft] = useState("");

  const artwork = artworks.find((a) => a.id === auction.artworkId);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(auction.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("Auction ended");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  if (!artwork) return null;

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <Card className="bg-gradient-to-r from-[#A26A5E] to-[#8B5A4E] text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Artwork Image */}
              <div className="lg:w-1/2 relative">
                <img
                  src={artwork.image || "/placeholder.svg"}
                  alt={artwork.title}
                  className="w-full h-full object-cover min-h-[300px]"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full" />
                    LIVE AUCTION
                  </span>
                </div>
              </div>

              {/* Auction Info */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <Hammer className="w-6 h-6" />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Active Auction
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold mb-2">
                  {artwork.title}
                </h2>
                <p className="text-white/80 mb-6">by {artwork.artistName}</p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Current Bid</p>
                    <p className="text-3xl font-bold">${auction.currentBid}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Time Left</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <p className="text-xl font-bold">{timeLeft}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-green-300" />
                  <span className="text-sm">
                    {auction.bidders.length} bids • Starting from $
                    {auction.startingBid}
                  </span>
                </div>

                <Button
                  onClick={() => router.push(`/auction/${auction.id}`)}
                  className="bg-white text-[#A26A5E] hover:bg-gray-100 font-bold py-6 text-lg"
                >
                  Place Your Bid
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
