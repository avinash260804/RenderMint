import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AppError } from "@/lib/errors";

export function apiError(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

export function formatZodErrors(error: ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return apiError(error.code, error.message, error.statusCode);
  }

  if (error instanceof ZodError) {
    return apiError("VALIDATION_ERROR", formatZodErrors(error), 400);
  }

  if (error instanceof Error) {
    console.error("[UNHANDLED_API_ERROR]", error);
  } else {
    console.error("[UNHANDLED_API_ERROR]", "Unknown error value", error);
  }

  return apiError("INTERNAL_SERVER_ERROR", "Something went wrong.", 500);
}
