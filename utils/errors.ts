/**
 * A standardized API Error class
 */
export class APIError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createErrorResponse = (message: string, statusCode: number = 500) => {
  return Response.json({ success: false, error: message }, { status: statusCode });
};
