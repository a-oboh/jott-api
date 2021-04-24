import { Request } from "express";

const bodyEmpty = (req: Request): boolean => {
  return req.body.constructor === Object && Object.keys(req.body).length === 0;
};

export { bodyEmpty };
