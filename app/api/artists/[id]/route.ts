import type { NextRequest } from "next/server";
import { artistsService } from "@/lib/firebase/services/artists";
import { apiHandler, successResponse, errorResponse } from "@/lib/api/utils";

export const GET = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const artist = await artistsService.getById(params.id);

    if (!artist) {
      return errorResponse("Artist not found", 404);
    }

    return successResponse({ artist });
  }
);

export const PUT = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const data = await request.json();
    await artistsService.update(params.id, data);
    return successResponse({ message: "Artist updated successfully" });
  }
);

export const DELETE = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await artistsService.delete(params.id);
    return successResponse({ message: "Artist deleted successfully" });
  }
);
