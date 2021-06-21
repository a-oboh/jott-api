import { Router } from "express";
import { AuthService } from "services/auth/authService";
import { AuthController } from "../controllers/authController";

export const authRouter = Router();

const authService = new AuthService();

const authCtrl = new AuthController(authService);

authRouter.post("/register", authCtrl.register.bind(authCtrl));

authRouter.post("/firebase-register", authCtrl.firebaseRegister.bind(authCtrl));

authRouter.post("/login", authCtrl.login.bind(authCtrl));

authRouter.post("/firebase-user", authCtrl.firebaseGetUser.bind(authCtrl));
