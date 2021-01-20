import { Router } from "express";
import { requireAuth } from "middleware/authMiddleware";
import { NoteController } from "../controllers/noteController";

export const noteRouter = Router();

const noteCtrl = new NoteController();

noteRouter.get("/get-notes/:userId", requireAuth, noteCtrl.getNotes);

noteRouter.post("/create-note", requireAuth, noteCtrl.createNote);

noteRouter.patch("/update-note/:id", requireAuth, noteCtrl.updateNote);

// noteRouter.get("/get/:id", authCtrl.getOne);

// noteRouter.get("/all", authCtrl.getAll);

// noteRouter.put("/update/:id", authCtrl.updateUser);

// noteRouter.delete("/remove/:id", authCtrl.remove);
