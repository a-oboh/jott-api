import { UserService } from "../userService";
import jwt from "jsonwebtoken";
import { User } from "../../entity/user";
import { HttpError } from "../../helpers/httpError";
import * as bcrypt from "bcrypt";

class Payload {
  id: string;
  firstName: string;
  lastName: string;
}

export class AuthService {
  private userService: UserService = new UserService();

  createToken(payload: Payload) {
    return jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
      // expiresIn: "3 days",
      subject: payload.id,
    });
  }

  async register(data: User) {
    try {
      const user = await this.userService.createUser(data);

      user.password = undefined;

      const token = this.createToken({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      return { user, access_token: token };
    } catch (err) {
      if ((err.message as string).includes("ER_DUP_ENTRY")) {
        throw new HttpError(
          `user with email ${data.email} already exists`,
          400
        );
      }
      throw new HttpError(err.message, 500);
    }
  }

  async login(email: string, password: string) {
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
      throw new HttpError("wrong credentials provided", 500);
    }
  }
}
