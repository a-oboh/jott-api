import { Router } from "express";
import { AuthController } from "../controllers/authController";

export const authRouter = Router();

const authCtrl = new AuthController();

authRouter.post("/register", authCtrl.register);

authRouter.post("/login", authCtrl.login);

// authRouter.get("/get/:id", authCtrl.getOne);

// authRouter.get("/all", authCtrl.getAll);

// authRouter.put("/update/:id", authCtrl.updateUser);

// authRouter.delete("/remove/:id", authCtrl.remove);
