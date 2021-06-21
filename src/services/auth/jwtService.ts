import { UserService } from "../userService";
import jwt from "jsonwebtoken";
import { User } from "../../entity/user";
import { HttpError } from "../../util/httpError";
import * as bcrypt from "bcryptjs";
import { currentConfig as config } from "config/index";

class Payload {
  id: string;
  firebaseId?: string;
  firstName: string;
  lastName: string;
}

export class JwtService {
  createToken(payload: Payload): string {
    return jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
      expiresIn: config.app.jwtLife,
      subject: payload.id,
    });
  }
}
