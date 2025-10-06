import type { NextRequest } from "next/server";
import { commissionsService } from "@/lib/firebase/services/commissions";
import { apiHandler, successResponse, errorResponse } from "@/lib/api/utils";

export const GET = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const commission = await commissionsService.getById(params.id);

    if (!commission) {
      return errorResponse("Commission not found", 404);
    }

    return successResponse({ commission });
  }
);

export const PUT = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { status, notes } = await request.json();

    if (!status) {
      return errorResponse("Status is required", 400);
    }

    await commissionsService.updateStatus(params.id, status, notes);
    return successResponse({ message: "Commission updated successfully" });
  }
);

export const DELETE = apiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    await commissionsService.delete(params.id);
    return successResponse({ message: "Commission deleted successfully" });
  }
);
