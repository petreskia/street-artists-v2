import type { NextRequest } from "next/server";
import { commissionsService } from "@/lib/firebase/services/commissions";
import {
  apiHandler,
  successResponse,
  errorResponse,
  getQueryParam,
} from "@/lib/api/utils";

export const GET = apiHandler(async (request: NextRequest) => {
  const artistId = getQueryParam(request.nextUrl, "artistId");

  if (!artistId) {
    return errorResponse("Artist ID is required", 400);
  }

  const stats = await commissionsService.getStats(artistId);
  return successResponse({ stats });
});
