import { NextFunction, Request, Response } from "express";
import { HttpError } from "../util/httpError";

const checkIdempotentKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idempotentKey = req.headers["x-idempotent-key"];

  if (!idempotentKey) {
    return next(new HttpError("idempotent key header cannot be empty", 400));
  }

  next();
};

export default checkIdempotentKey;
