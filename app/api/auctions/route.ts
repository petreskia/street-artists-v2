import type { NextRequest } from "next/server";
import { auctionsService } from "@/lib/firebase/services/auctions";
import {
  apiHandler,
  successResponse,
  errorResponse,
  validateFields,
  getQueryParam,
} from "@/lib/api/utils";

export const GET = apiHandler(async (request: NextRequest) => {
  const url = request.nextUrl;
  const active = getQueryParam(url, "active");

  let auctions;

  if (active === "true") {
    const activeAuction = await auctionsService.getActive();
    auctions = activeAuction ? [activeAuction] : [];
  } else {
    auctions = await auctionsService.getAll();
  }

  return successResponse({ auctions });
});

export const POST = apiHandler(async (request: NextRequest) => {
  const data = await request.json();

  const error = validateFields(data, ["artworkId", "startingBid", "endTime"]);
  if (error) return errorResponse(error, 400);

  const auctionId = await auctionsService.create({
    artworkId: data.artworkId,
    startingBid: data.startingBid,
    endTime: new Date(data.endTime),
    isActive: true,
  });

  return successResponse(
    { id: auctionId, message: "Auction created successfully" },
    201
  );
});
