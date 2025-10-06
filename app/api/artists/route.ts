import type { NextRequest } from "next/server";
import { artistsService } from "@/lib/firebase/services/artists";
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
  const trending = getQueryParam(url, "trending");

  let artists;

  if (search) {
    artists = await artistsService.search(search);
  } else if (trending) {
    const limit = Number.parseInt(trending) || 6;
    artists = await artistsService.getTrending(limit);
  } else {
    artists = await artistsService.getAll();
  }

  return successResponse({ artists });
});

export const POST = apiHandler(async (request: NextRequest) => {
  const data = await request.json();

  const error = validateFields(data, ["name", "bio", "location"]);
  if (error) return errorResponse(error, 400);

  const artistId = await artistsService.create({
    ...data,
    popularity: 0,
    artworkCount: 0,
    likes: 0,
    specialties: data.specialties || [],
    createdAt: new Date(),
  });

  return successResponse(
    { id: artistId, message: "Artist created successfully" },
    201
  );
});
