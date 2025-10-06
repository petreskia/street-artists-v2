"use client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Artist } from "@/types";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../layout/MapComponent"), {
  ssr: false,
});

interface ArtistMapProps {
  artists: Artist[];
}

export function ArtistMap({ artists }: ArtistMapProps) {
  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Global Artist Network
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover street artists from around the world
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[500px] w-full">
              <MapComponent artists={artists} />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Active Artists ({artists.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#A26A5E]" />
            <span>Click markers to view details</span>
          </div>
        </div>
      </div>
    </section>
  );
}
