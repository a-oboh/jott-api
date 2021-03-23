import { NextFunction, Request, Response } from "express";
import { Note } from "../entity/note";
import { HttpError } from "../helpers/httpError";
import { UserService } from "../services/userService";
import { NoteService } from "../services/notes/noteService";
import { RedisService } from "../services/redis/redisService";
import { cacheRequest } from "helpers/cache";
import paginate from "helpers/paginate";
import { logger } from "helpers/logger";

export class NoteController {
  userService: UserService = new UserService();
  noteService: NoteService = new NoteService();
  redisService: RedisService = new RedisService();

  getNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;

      const user = await this.userService.getUserById(userId);

      const notes = await this.noteService.getNotesByOwner(user);

      // get page and limit for pagination
      const { page = `1`, limit = `10` } = req.query;

      //paginate data
      const result = paginate(<[]>notes, <string>page, <string>limit);

      return res.json({
        status: "success",
        message: "notes retrieved successfully",
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

  getSingleNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, noteId } = req.params;

      //check if user note cached
      const resSaved = await this.redisService.getValue(`note_${noteId}`);

      if (resSaved) {
        const result = JSON.parse(resSaved);
        return res.send({
          status: "success",
          message: "note retrieved successfully",
          data: result,
        });
      }

      const user = await this.userService.getUserById(userId);

      const note = await this.noteService.getSingleNote(user, noteId);

      const response = {
        status: "success",
        message: "note retrieved successfully",
        data: note,
      };

      await cacheRequest(`note_${note.id}`, JSON.stringify(note), 3600);

      return res.json(response);
    } catch (err) {
      return next(err);
    }
  };

  createNote = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new HttpError("request body cannot be empty", 400));
    }

    try {
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
          message: "note not modified",
          data: obj.data,
        });
      }

      const ownerId: string = req.user.id;
      const title: string = req.body.title;
      const content: string = req.body.content;

      const user = await this.userService.getUserById(ownerId);
      user.password = undefined;

      const noteToSave = new Note();

      noteToSave.title = title;
      noteToSave.content = content;
      noteToSave.owner = user;

      const newNote = await this.noteService.createNote(noteToSave);

      const response = {
        status: "success",
        message: "note created successfully",
        data: newNote,
      };

      //store idempotent key and response in cache
      await cacheRequest(idempotentKey.toString(), JSON.stringify(response));

      await cacheRequest(`note_${newNote.id}`, JSON.stringify(response), 3600);

      return res.status(201).json(response);
    } catch (err) {
      return next(err);
    }
  };

  updateNote = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
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

      const title: string = req.body.title;
      const content: string = req.body.content;

      const noteToSave = await this.noteService.getNoteById(id);

      noteToSave.title = title;
      noteToSave.content = content;

      const updatedNote = await this.noteService.updateNote(noteToSave);

      const response = {
        status: "success",
        message: "note updated successfully",
        data: updatedNote,
      };

      //store idempotent key and response in cache
      await cacheRequest(idempotentKey.toString(), JSON.stringify(response));

      await cacheRequest(
        `note_${updatedNote.id}`,
        JSON.stringify(response),
        60000
      );

      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  };

  deleteSingleNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { noteId } = req.params;

      await this.noteService.deleteNote(noteId);

      await this.redisService.deleteKey(`note_${noteId}`);

      res.send({
        status: "success",
        message: "note deleted successfully",
      });
    } catch (err) {
      return next(err);
    }
  };
}
