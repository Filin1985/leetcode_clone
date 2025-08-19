import { ApiError } from '../errors/index.js';
import type {Request, Response, NextFunction} from "express";

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(message, statusCode);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export { errorHandler };
