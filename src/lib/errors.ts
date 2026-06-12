export class AppError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized.") {
    super("UNAUTHORIZED", message, 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden.") {
    super("FORBIDDEN", message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found.") {
    super("NOT_FOUND", message, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict.") {
    super("CONFLICT", message, 409);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests.") {
    super("RATE_LIMITED", message, 429);
    this.name = "RateLimitError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid request.") {
    super("VALIDATION_ERROR", message, 400);
    this.name = "ValidationError";
  }
}
