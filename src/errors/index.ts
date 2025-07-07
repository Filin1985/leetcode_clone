class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request') {
      super(message, 400);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
      super(message, 401);
  }
}

class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
      super(message, 403);
  }
}

class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found') {
      super(message, 404);
  }
}

class ConflictError extends ApiError {
  constructor(message: string = 'Conflict') {
      super(message, 409);
  }
}

export {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
};