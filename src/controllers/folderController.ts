import { Folder } from "entity/folder";
import { Note } from "entity/note";
import { NextFunction, Response, Request } from "express";
import { cacheRequest } from "helpers/cache";
import { HttpError } from "helpers/httpError";
import { FolderService } from "services/folders/folderService";
import { NoteService } from "services/notes/noteService";
import { RedisService } from "services/redis/redisServices";
import { UserService } from "services/userService";

export class FolderController {
  userService: UserService = new UserService();
  redisService: RedisService = new RedisService();
  folderService: FolderService = new FolderService();
  noteService: NoteService = new NoteService();

  createFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return next(new HttpError("request body cannot be empty", 400));
      }

      const idempotentKey = req.headers["x-idempotent-key"];

      if (!idempotentKey) {
        return next(
          new HttpError("idempotent key header cannot be empty", 400)
        );
      }

      //check if the request has been sent before
      const resSaved = await this.redisService.getValue(
        idempotentKey.toString()
      );

      const obj = JSON.parse(resSaved);

      if (resSaved) {
        return res.status(304).json({
          status: "not modified",
          message: "folder not modified",
          data: obj.data,
        });
      }

      const ownerId: string = req.user.id;
      const name: string = req.body.name;
      const description: string = req.body.description;
      const items: string[] = req.body.items;

      const notes: Note[] = [];

      const user = await this.userService.getUserById(ownerId);
      user.password = undefined;

      const folderToSave = new Folder();

      folderToSave.name = name;
      folderToSave.description = description;
      folderToSave.owner = user;

      if (items.length > 0) {
        items.forEach(async (i) => {
          const note = await this.noteService.getNoteById(i);

          notes.push(note);
        });
      }

      folderToSave.notes = notes;

      const newFolder = await this.folderService.createFolder(folderToSave);

      const response = {
        status: "success",
        message: "new folder created successfully",
        data: newFolder,
      };

      //store idempotent key and response in cache
      await cacheRequest(idempotentKey.toString(), JSON.stringify(response));

      await cacheRequest(`folder_${newFolder.id}`, JSON.stringify(response), 600);

      return res.status(201).json(response);
    } catch (e) {
      return next(e);
    }
  };
}
