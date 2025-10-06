import type { NextRequest } from "next/server";
import { commissionsService } from "@/lib/firebase/services/commissions";
import { performancesService } from "@/lib/firebase/services/performances";
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
  const type = getQueryParam(url, "type"); // 'commissions', 'performances', 'financial', 'all'
  const startDate = getQueryParam(url, "startDate");
  const endDate = getQueryParam(url, "endDate");

  if (!artistId) {
    return errorResponse("Artist ID is required", 400);
  }

  let stats: any = {};

  switch (type) {
    case "commissions":
      stats = await commissionsService.getStats(artistId);
      break;

    case "performances":
      stats = await performancesService.getStats(
        artistId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );
      break;

    case "financial":
      stats = await analyticsService.getFinancialStats(
        artistId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );
      break;

    case "all":
      // Get all stats in one request
      stats = {
        commissions: await commissionsService.getStats(artistId),
        performances: await performancesService.getStats(
          artistId,
          startDate ? new Date(startDate) : undefined,
          endDate ? new Date(endDate) : undefined
        ),
        financial: await analyticsService.getFinancialStats(
          artistId,
          startDate ? new Date(startDate) : undefined,
          endDate ? new Date(endDate) : undefined
        ),
      };
      break;

    default:
      return errorResponse(
        "Invalid type parameter. Use: commissions, performances, financial, or all",
        400
      );
  }

  return successResponse({ stats });
});
