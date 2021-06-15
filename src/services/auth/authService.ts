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

interface firebasePayload {
  firebaseUid: string;
  name: string;
  email: string;
  photoUrl: string;
}

export class AuthService {
  private userService: UserService = new UserService();

  createToken(payload: Payload): string {
    return jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
      expiresIn: config.app.jwtLife,
      subject: payload.id,
    });
  }

  async register(data: User): Promise<any> {
    try {
      await data.hashPassword(data.password);
      const user = await this.userService.createUser(data);

      user.password = undefined;

      const token = this.createToken({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      return { user, access_token: token };
    } catch (err) {
      if ((err.message as string).includes("Duplicate")) {
        throw new HttpError(
          `user with email ${data.email} already exists`,
          400
        );
      }
      throw new HttpError(err.message, 500);
    }
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = this.createToken({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        });

        user.password = undefined;

        return { user, access_token: token };
      } else {
        throw new HttpError("wrong credentials provided", 400);
      }
    } else {
      throw new HttpError("wrong credentials provided", 400);
    }
  }

  async getUser(email: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (user.firebaseUuid) {
      const token = this.createToken({
        id: user.id,
        firebaseId: user.firebaseUuid,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      return { user, access_token: token };
    } else {
      throw new HttpError("wrong credentials provided", 400);
    }
  }

  async firebaseRegister(data: User): Promise<any> {
    try {
      const user = await this.userService.createUser(data);

      const token = this.createToken({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      return { user, access_token: token };
    } catch (err) {
      if ((err.message as string).includes("Duplicate")) {
        throw new HttpError(
          `user with email ${data.email} already exists`,
          400
        );
      }

      throw new HttpError(err.message, 500);
    }
  }
}
