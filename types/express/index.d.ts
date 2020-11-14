import { Response } from "express-serve-static-core";

// declare namespace Express {
//    interface Request {
//     user?: object;
//   }
//   interface Response {
//     user?: object;
//   }
// }

declare module "express-serve-static-core" {
  export interface Request {
    user?: object;
  }

  export interface Response {
    user?: object;
  }
}
