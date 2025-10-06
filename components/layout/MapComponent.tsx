"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Artist } from "@/types";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface MapComponentProps {
  artists: Artist[];
}

export default function MapComponent({ artists }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([20, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(leafletMapRef.current);

      artists.forEach((artist) => {
        const marker = L.marker([
          artist.location.coordinates.lat,
          artist.location.coordinates.lng,
        ]).addTo(leafletMapRef.current!);

        marker.bindPopup(`
          <div style="text-align:center;">
            <img src="${
              artist.profileImage || "/placeholder.svg"
            }" style="width:64px;height:64px;border-radius:50%;margin-bottom:8px;" />
            <h3>${artist.name}</h3>
            <p>${artist.location.city}, ${artist.location.country}</p>
            <p>${artist.artworkCount} artworks</p>
          </div>
        `);
      });
    }

    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, [artists]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
