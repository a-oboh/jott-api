import { Response } from "express";

class HttpError extends Error {
  statusCode: number;
  message: string;

  constructor(message: string, statusCode: number = 500, stack = null) {
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
  // console.log('erroorrrroorrrr')

  const { statusCode, message } = err;

  console.error(err);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

export { HttpError, handleError };
