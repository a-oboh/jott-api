import { NextFunction, Response } from "express";
import { logger } from "./logger";

class HttpError extends Error {
  statusCode: number;
  message: string;

  constructor(message: string, statusCode = 500) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);

    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this);
  }
}

class InternalServerError extends HttpError {
  constructor(message: string) {
    super(message, 500);
  }
}

class BadRequest extends HttpError {
  constructor(message: string) {
    super(message, 400);
  }
}

class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const handleError = (err: any, res: Response, next: NextFunction) => {
  const { statusCode = 500, message, stack } = err;

  logger.error(err);

 return next(res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  }));
};

export { HttpError, BadRequest, InternalServerError, NotFoundError, handleError };
