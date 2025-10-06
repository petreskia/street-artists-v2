import type { NextRequest } from "next/server";
import { artworksService } from "@/lib/firebase/services/artworks";
import {
  apiHandler,
  successResponse,
  errorResponse,
  validateFields,
  getQueryParam,
} from "@/lib/api/utils";

export const GET = apiHandler(async (request: NextRequest) => {
  const url = request.nextUrl;
  const search = getQueryParam(url, "search");
  const top = getQueryParam(url, "top");
  const published = getQueryParam(url, "published");
  const artistId = getQueryParam(url, "artistId");

  let artworks;

  if (search) {
    artworks = await artworksService.search(search);
  } else if (top) {
    const limit = Number.parseInt(top) || 12;
    artworks = await artworksService.getTop(limit);
  } else if (published === "true") {
    artworks = await artworksService.getPublished();
  } else if (artistId) {
    artworks = await artworksService.getByArtist(artistId);
  } else {
    artworks = await artworksService.getAll();
  }

  return successResponse({ artworks });
});

export const POST = apiHandler(async (request: NextRequest) => {
  const data = await request.json();

  const error = validateFields(data, ["artistId", "title", "type", "price"]);
  if (error) return errorResponse(error, 400);

  const artworkId = await artworksService.create({
    ...data,
    views: 0,
    likes: 0,
    isPublished: data.isPublished || false,
    auctionStatus: false,
    tags: data.tags || [],
    createdAt: new Date(),
  });

  return successResponse(
    { id: artworkId, message: "Artwork created successfully" },
    201
  );
});
