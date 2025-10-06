import type { NextRequest } from "next/server";
import { artworksService } from "@/lib/firebase/services/artworks";
import { apiHandler, successResponse, errorResponse } from "@/lib/api/utils";

export const POST = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { action } = await request.json();

    if (action === "like") {
      await artworksService.toggleLike(params.id, true);
    } else if (action === "unlike") {
      await artworksService.toggleLike(params.id, false);
    } else {
      return errorResponse("Invalid action. Must be 'like' or 'unlike'", 400);
    }

    return successResponse({ message: "Action completed successfully" });
  }
);
