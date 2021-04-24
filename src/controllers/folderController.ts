/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Folder } from "../entity/folder";
import { Note } from "../entity/note";
import { NextFunction, Response, Request } from "express";
import { cacheRequest } from "../helpers/cache";
import { HttpError } from "../helpers/httpError";
import { logger } from "../helpers/logger";
import {paginate} from "../helpers/paginate";
import { bodyEmpty } from "../helpers/util";
import { FolderService } from "../services/folders/folderService";
import { NoteService } from "../services/notes/noteService";
import { RedisService } from "../services/redis/redisService";
import { UserService } from "../services/userService";

export class FolderController {
  userService: UserService = new UserService();
  redisService: RedisService = new RedisService();
  folderService: FolderService = new FolderService();
  noteService: NoteService = new NoteService();

  getAllFolders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const userId = req.params.userId;

      // get page and limit for pagination
      const { page = `1`, limit = `10`, userId } = req.query;

      if (!userId) {
        return next(new HttpError("User ID cannot be empty", 400));
      }

      const user = await this.userService.getUserById(<string>userId);

      const folders = await this.folderService.getFoldersByOwner(user);

      //paginate data
      const result = paginate(<[]>folders, <string>page, <string>limit);

      return res.json({
        status: "success",
        message: "folders retrieved successfully",
        data: result.result,
        nextPage: result.nextPage,
        previousPage: result.previousPage,
        limit: result.limitNum,
        count: result.result.length,
      });
    } catch (err) {
      return next(err);
    }
  };

  getSingleFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, folderId } = req.query;

      if (!folderId) {
        return next(new HttpError("folder ID cannot be empty", 400));
      }

      //check if user folder cached
      const resSaved = await this.redisService.getValue(`folder_${folderId}`);

      if (resSaved) {
        const result = JSON.parse(resSaved);
        return res.send({
          status: "success",
          message: "folder retrieved successfully",
          data: result,
        });
      }

      const user = await this.userService.getUserById(<string>userId);

      const folder = await this.folderService.getFolderById(<string>folderId);

      const response = {
        status: "success",
        message: "folder retrieved successfully",
        data: folder,
      };

      await cacheRequest(`folder_${folder.id}`, JSON.stringify(folder), 3600);

      return res.json(response);
    } catch (err) {
      return next(err);
    }
  };

  createFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body || bodyEmpty(req)) {
        return next(new HttpError("request body cannot be empty", 400));
      }

      const idempotentKey = req.headers["x-idempotent-key"];

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
      const items: string[] = req.body.items || [];

      const notes: Note[] = [];

      const user = await this.userService.getUserById(ownerId);
      (user.password = undefined),
        (user.resetCode = undefined),
        (user.confirmationToken = undefined);

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

      await cacheRequest(
        `folder_${newFolder.id}`,
        JSON.stringify(response),
        600
      );

      return res.status(201).json(response);
    } catch (e) {
      return next(e);
    }
  };

  updateFolder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || bodyEmpty(req)) {
      return next(new HttpError("request body cannot be empty", 400));
    }

    try {
      const idempotentKey = req.headers["x-idempotent-key"];

      //check if data is cached
      const resSaved = await this.redisService.getValue(
        idempotentKey.toString()
      );

      const obj = JSON.parse(resSaved);

      if (resSaved) {
        return res.status(304).json({
          status: "not modified",
          message: "note not modified",
          data: obj.data,
        });
      }

      const id: string = req.params.id;

      const name: string = req.body.name;
      const description: string = req.body.description;
      const items: string[] = req.body.items || [];

      const folderToSave = await this.folderService.getFolderById(id);

      folderToSave.name = name;
      folderToSave.description = description;

      if (items.length > 0) {
        const notes: Note[] = [];

        items.forEach(async (i) => {
          const note = await this.noteService.getNoteById(i);

          notes.push(note);
        });

        folderToSave.notes = notes;
      }

      const updatedFolder = await this.folderService.updateFolder(folderToSave);

      const response = {
        status: "success",
        message: "folder updated successfully",
        data: updatedFolder,
      };

      //store idempotent key and response in cache
      await cacheRequest(idempotentKey.toString(), JSON.stringify(response));

      await cacheRequest(
        `folder_${updatedFolder.id}`,
        JSON.stringify(response),
        3600
      );

      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  };

  deleteSingleFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { folderId } = req.params;

      await this.folderService.deleteFolder(folderId);

      await this.redisService.deleteKey(`folder_${folderId}`);

      res.send({
        status: "success",
        message: "folder deleted successfully",
      });
    } catch (err) {
      return next(err);
    }
  };
}
