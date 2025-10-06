"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/landing/hero";
import { FeaturedArtists } from "@/components/landing/featured-artists";
import { TopArtworks } from "@/components/landing/top-artworks";
import { AuctionWidget } from "@/components/landing/auction-widget";
import { ArtistMap } from "@/components/landing/artist-map";
import { CallToAction } from "@/components/landing/call-to-action";
import { SearchBar } from "@/components/landing/search-bar";
import { useApp } from "@/context/app-context";

export default function LandingPage() {
  const { artists, artworks, auctions, loading } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const activeAuction = auctions.find((auction) => auction.isActive);

  const trendingArtists = artists
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  const topArtworks = artworks
    .filter((artwork) => artwork.isPublished)
    .sort((a, b) => b.views + b.likes - (a.views + a.likes))
    .slice(0, 12);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#A26A5E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Hero Section */}
      <Hero />

      {/* Active Auction Widget */}
      {activeAuction && <AuctionWidget auction={activeAuction} />}

      {/* Featured Artists */}
      <FeaturedArtists artists={trendingArtists} />

      {/* Top Artworks */}
      <TopArtworks artworks={topArtworks} />

      {/* Artist Map */}
      <ArtistMap artists={artists} />

      {/* Call to Action */}
      <CallToAction />
    </div>
  );
}
