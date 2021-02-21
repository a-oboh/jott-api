import { Router } from "express";
import { requireAuth } from "middleware/authMiddleware";
import checkIdempotentKey from "middleware/idempotencyMiddleware";
import { NoteController } from "../controllers/noteController";

export const noteRouter = Router();

const noteCtrl = new NoteController();

noteRouter.get("/get-notes/:userId", requireAuth, noteCtrl.getNotes);

noteRouter.get("/get-note/:userId/:noteId", requireAuth, noteCtrl.getSingleNote);

noteRouter.post("/create-note", requireAuth, checkIdempotentKey, noteCtrl.createNote);

noteRouter.patch("/update-note/:id", requireAuth, checkIdempotentKey, noteCtrl.updateNote);

noteRouter.patch("/delete-note/:id", requireAuth, noteCtrl.deleteSingleNote);

// noteRouter.get("/get/:id", authCtrl.getOne);

// noteRouter.get("/all", authCtrl.getAll);

// noteRouter.put("/update/:id", authCtrl.updateUser);

// noteRouter.delete("/remove/:id", authCtrl.remove);
