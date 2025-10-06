import type { NextRequest } from "next/server";
import { auctionsService } from "@/lib/firebase/services/auctions";
import {
  apiHandler,
  successResponse,
  errorResponse,
  validateFields,
} from "@/lib/api/utils";

export const POST = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const data = await request.json();

    const error = validateFields(data, ["userId", "amount"]);
    if (error) return errorResponse(error, 400);

    const auction = await auctionsService.getById(params.id);

    if (!auction) {
      return errorResponse("Auction not found", 404);
    }

    if (!auction.isActive) {
      return errorResponse("Auction is not active", 400);
    }

    if (data.amount <= auction.currentBid) {
      return errorResponse("Bid must be higher than current bid", 400);
    }

    if (new Date() > auction.endTime) {
      await auctionsService.endAuction(params.id);
      return errorResponse("Auction has ended", 400);
    }

    await auctionsService.placeBid(params.id, data.userId, data.amount);

    return successResponse({
      message: "Bid placed successfully",
      currentBid: data.amount,
    });
  }
);
