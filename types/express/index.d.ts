import { Response } from "express-serve-static-core";

// declare namespace Express {
//    interface Request {
//     user?: object;
//   }
//   interface Response {
//     user?: object;
//   }
// }

interface UserEntity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  confirmationToken?: string;
  resetCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

declare module "express-serve-static-core" {
  export interface Request {
    user?: UserEntity;
  }

  export interface Response {
    user?: {};
  }
}
