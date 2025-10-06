import type { NextRequest } from "next/server";
import { artworksService } from "@/lib/firebase/services/artworks";
import { apiHandler, successResponse, errorResponse } from "@/lib/api/utils";

export const GET = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const artwork = await artworksService.getById(params.id);

    if (!artwork) {
      return errorResponse("Artwork not found", 404);
    }

    await artworksService.incrementViews(params.id);
    return successResponse({ artwork });
  }
);

export const PUT = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const data = await request.json();
    await artworksService.update(params.id, data);
    return successResponse({ message: "Artwork updated successfully" });
  }
);

export const DELETE = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await artworksService.delete(params.id);
    return successResponse({ message: "Artwork deleted successfully" });
  }
);
