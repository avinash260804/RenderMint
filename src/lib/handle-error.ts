import { NextResponse } from "next/server";

export class AppError extends Error {
  status: number;
  statusCode: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.statusCode = status;
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
