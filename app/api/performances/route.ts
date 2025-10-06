import type { NextRequest } from "next/server";
import { performancesService } from "@/lib/firebase/services/performances";
import {
  apiHandler,
  successResponse,
  errorResponse,
  validateFields,
  getQueryParam,
} from "@/lib/api/utils";

export const GET = apiHandler(async (request: NextRequest) => {
  const artistId = getQueryParam(request.nextUrl, "artistId");

  if (!artistId) {
    return errorResponse("Artist ID is required", 400);
  }

  const performances = await performancesService.getByArtist(artistId);
  return successResponse({ performances });
});

export const POST = apiHandler(async (request: NextRequest) => {
  const data = await request.json();

  const error = validateFields(data, ["artistId", "location"]);
  if (error) return errorResponse(error, 400);

  const performanceId = await performancesService.start(
    data.artistId,
    data.location
  );
  return successResponse(
    { id: performanceId, message: "Performance started successfully" },
    201
  );
});
