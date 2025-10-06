"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import type { Artist } from "@/types";

interface FeaturedArtistsProps {
  artists: Artist[];
}

export function FeaturedArtists({ artists }: FeaturedArtistsProps) {
  const router = useRouter();
  const { currentUser, toggleFavoriteArtist } = useApp();

  const isLiked = (artistId: string) => {
    return currentUser?.likedArtists.includes(artistId) || false;
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Trending Artists
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the most popular street artists right now
            </p>
          </div>
          <Button
            onClick={() => router.push("/artists")}
            variant="outline"
            className="hidden md:block"
          >
            View All Artists
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <Card
              key={artist.id}
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => router.push(`/artist/${artist.id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={artist.profileImage || "/placeholder.svg"}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteArtist(artist.id);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked(artist.id)
                        ? "fill-red-500 text-red-500"
                        : "text-white"
                    }`}
                  />
                </button>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {artist.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {artist.bio}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{artist.location.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    <span>{artist.artworkCount} works</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {artist.specialties.slice(0, 3).map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-[#A26A5E] bg-opacity-10 text-[#A26A5E] text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button onClick={() => router.push("/artists")}>
            View All Artists
          </Button>
        </div>
      </div>
    </section>
  );
}
