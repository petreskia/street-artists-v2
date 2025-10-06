import type { NextRequest } from "next/server";
import { artistsService } from "@/lib/firebase/services/artists";
import { apiHandler, successResponse, errorResponse } from "@/lib/api/utils";

export const POST = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { action } = await request.json();

    if (action === "like") {
      await artistsService.incrementLikes(params.id);
    } else if (action === "unlike") {
      await artistsService.decrementLikes(params.id);
    } else {
      return errorResponse("Invalid action. Must be 'like' or 'unlike'", 400);
    }

    return successResponse({ message: "Action completed successfully" });
  }
);
