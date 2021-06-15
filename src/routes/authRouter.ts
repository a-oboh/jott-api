import { Router } from "express";
import { AuthService } from "services/auth/authService";
import { AuthController } from "../controllers/authController";

export const authRouter = Router();

const authService = new AuthService()

const authCtrl = new AuthController(authService);

authRouter.post("/register", authCtrl.register);

authRouter.post("/login", authCtrl.login);

authRouter.post("/firebase-user", authCtrl.firebaseGetUser);

// authRouter.get("/all", authCtrl.getAll);

// authRouter.put("/update/:id", authCtrl.updateUser);

// authRouter.delete("/remove/:id", authCtrl.remove);
