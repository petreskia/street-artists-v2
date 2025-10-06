import type { NextRequest } from "next/server";
import { auctionsService } from "@/lib/firebase/services/auctions";
import { apiHandler, successResponse, errorResponse } from "@/lib/api/utils";

export const GET = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const auction = await auctionsService.getById(params.id);

    if (!auction) {
      return errorResponse("Auction not found", 404);
    }

    return successResponse({ auction });
  }
);
