import { Response } from "express";
import { logger } from "./logger";

class HttpError extends Error {
  statusCode: number;
  message: string;

  constructor(message: string, statusCode = 500, stack = null) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);

    // this.stack = stack;

    // Error.captureStackTrace(this);

    // // Set the prototype explicitly.
    // Object.setPrototypeOf(this, HttpError.prototype);
  }
}

const handleError = (err: any, res: Response) => {
  const { statusCode = 500, message } = err;

  // logger.error(message);
  logger.error(err);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

export { HttpError, handleError };
