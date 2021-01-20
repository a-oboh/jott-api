import { NextFunction, Request, Response } from "express";
import { Note } from "../entity/note/note";
import { HttpError } from "../helpers/httpError";
import { UserService } from "../services/userService";
import { NoteService } from "../services/notes/noteService";
import { RedisService } from "../services/redis/redisServices";
import { cacheRequest } from "helpers/cache";

export class NoteController {
  constructor() {}

  // userService: UserService;
  // noteService: NoteService;
  // redisService: RedisService;

  async getNotes(req: Request, res: Response, next: NextFunction) {}

  async createNote(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      return next(new HttpError("request body cannot be empty", 400));
    }

    let userService = new UserService();
    let noteService = new NoteService();
    const redisService = new RedisService();

    try {
      const idempotentKey = req.headers["x-idempotent-key"];

      if (!idempotentKey) {
        return next(
          new HttpError("idempotent key header cannot be empty", 400)
        );
      }

      //check if data is cached
      const resSaved = await redisService.getValue(idempotentKey.toString());

      var obj = JSON.parse(resSaved);

      if (resSaved) {
        return res.status(304).json({
          status: "not modified",
          message: "note not modified",
          data: obj.data,
        });
      }

      // const {title, content, ownerId} = req.body;
      const ownerId: string = req.user.id;
      const title: string = req.body.title;
      const content: string = req.body.content;

      const user = await userService.getUserById(ownerId);

      const noteToSave = new Note();

      noteToSave.title = title;
      noteToSave.content = content;
      noteToSave.owner = user;

      const newNote = await noteService.createNote(noteToSave);

      const response = {
        status: "success",
        message: "note created successfully",
        data: newNote,
      };

      //store idempotent key and response in cache
      await cacheRequest(idempotentKey.toString(), JSON.stringify(response));

      res.status(201).json(response);
    } catch (err) {
      // return res.status(500).send({
      //   status: "error",
      //   message: err.message || `error creating new note`,
      // });
      return next(err);
    }
  }

  async updateNote(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      return next(new HttpError("request body cannot be empty", 400));
    } else if (!req.params) {
      return next(new HttpError("note id cannot be empty", 400));
    }

    try {
      let redisService = new RedisService();
      let noteService = new NoteService();

      const idempotentKey = req.headers["x-idempotent-key"];

      if (!idempotentKey) {
        return next(
          new HttpError("idempotent key header cannot be empty", 400)
        );
      }

      //check if data is cached
      const resSaved = await redisService.getValue(idempotentKey.toString());

      var obj = JSON.parse(resSaved);

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

      const noteToSave = await noteService.getNoteById(id);

      noteToSave.title = title;
      noteToSave.content = content;

      const updatedNote = await noteService.updateNote(noteToSave);

      const response = {
        status: "success",
        message: "note updated successfully",
        data: updatedNote,
      };

      //store idempotent key and response in cache
      await cacheRequest(idempotentKey.toString(), JSON.stringify(response));

      res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  }
}
