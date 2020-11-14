class HttpError extends Error {
  code: number;
  message: string;

  constructor(message: string, code: number = 500, stack = null) {
    super(message);
    this.code = code;
    this.message = message;
    // this.stack = stack;

    Error.captureStackTrace(this);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

export { HttpError, handleError };
