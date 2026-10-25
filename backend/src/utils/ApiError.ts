export type ApiErrorDetails = Record<string, unknown>;

/** Throw this from a service to send a clean error response. */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: ApiErrorDetails | null;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details: ApiErrorDetails | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message: string, details?: ApiErrorDetails) =>
  new ApiError(400, "VALIDATION_ERROR", message, details ?? null);

export const notFound = (what: string) =>
  new ApiError(404, "NOT_FOUND", `${what} not found.`);

export const conflict = (message: string, code = "CONFLICT") =>
  new ApiError(409, code, message);
