import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import checkIdempotentKey from "../middleware/idempotencyMiddleware";
import { FolderController } from "../controllers/folderController";

export const folderRouter = Router();

const folderCtrl = new FolderController();

folderRouter.get("/get-folders", requireAuth, folderCtrl.getAllFolders);

folderRouter.get("/get-single-folder", requireAuth, folderCtrl.getSingleFolder);

folderRouter.post("/create-folder", requireAuth, checkIdempotentKey, folderCtrl.createFolder);

folderRouter.patch("/update-folder/:id", requireAuth, checkIdempotentKey, folderCtrl.updateFolder);

folderRouter.delete("/delete-folder/:folderId", requireAuth, folderCtrl.deleteSingleFolder);
