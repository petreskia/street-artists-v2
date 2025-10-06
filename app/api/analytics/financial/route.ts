import type { NextRequest } from "next/server";
import { analyticsService } from "@/lib/firebase/services/analytics";
import {
  apiHandler,
  successResponse,
  errorResponse,
  getQueryParam,
} from "@/lib/api/utils";

export const GET = apiHandler(async (request: NextRequest) => {
  const url = request.nextUrl;
  const artistId = getQueryParam(url, "artistId");
  const startDate = getQueryParam(url, "startDate");
  const endDate = getQueryParam(url, "endDate");

  if (!artistId) {
    return errorResponse("Artist ID is required", 400);
  }

  const stats = await analyticsService.getFinancialStats(
    artistId,
    startDate ? new Date(startDate) : undefined,
    endDate ? new Date(endDate) : undefined
  );

  return successResponse({ stats });
});
