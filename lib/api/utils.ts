import { NextResponse } from "next/server";

// Standard error response
export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

// Standard success response
export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// Validate required fields
export function validateFields(
  data: any,
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!data[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

// Async handler wrapper with error handling
export function apiHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("API Error:", error);
      return errorResponse("An unexpected error occurred", 500);
    }
  };
}

// Parse query params helper
export function getQueryParam(url: URL, param: string): string | null {
  return url.searchParams.get(param);
}
