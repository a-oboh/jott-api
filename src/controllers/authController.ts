import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth/authService";
import { HttpError } from "../helpers/httpError";
import { User } from "entity/user";

export class AuthController {
  //   private userRepository = getRepository(User);

  //   private userService: UserService = new UserService(this.userRepository);
  //   private authService: AuthService;

  //   constructor() {
  //     this.authService = new AuthService();
  //   }

  async register(req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "body empty",
      });
    }

    let newUser = new User();

    newUser.email = req.body.email;
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.password = req.body.password;

    try {
      let authService = new AuthService();
      const user = await authService.register(newUser);

      return res.send({
        status: "success",
        message: "registered user successfully",
        data: user,
      });
    } catch (err) {
      if (err instanceof HttpError) {
        return res.status(err.statusCode).send({
          status: "error",
          message: err.message || `error registering new user`,
        });
      }
      return res.status(500).send({
        status: "error",
        message: err.message || `error registering new user`,
      });
    }
  }

  async login(req: Request, res: Response) {
    if (!req.body) {
        return res.status(400).send({
          status: "error",
          message: "request body cannot be empty",
        });
    }

    const { email, password } = req.body;

    try {
      let authService = new AuthService();
      const user = await authService.login(email, password);

      return res.send({
        status: "success",
        message: "login successful",
        data: user,
      });
    } catch (err) {
      if (err instanceof HttpError) {
        return res.status(err.statusCode).send({
          status: "error",
          message: err.message || `error while trying to login user`,
        });
      }
      return res.status(500).send({
        status: "error",
        message: err.message || `error while trying to login user`,
      });
    }
  }
}
