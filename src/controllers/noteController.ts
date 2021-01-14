import { NextFunction, Request, Response } from "express";
import { Note } from "../entity/note/note";
import { HttpError } from "../helpers/httpError";
import { UserService } from "../services/userService";
import { NoteService } from "../services/notes/noteService";
import { RedisService } from "../services/redis/redisServices";

export class NoteController {
  constructor() {}

  async createNote(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      return next(new HttpError("request body cannot be empty", 400));
    }

    let userService = new UserService();
    let noteService = new NoteService();
    let redisService = new RedisService();

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
        message: "registered user successfully",
        data: newNote,
      };

      //store idempotent key and response in cache
      await redisService.setValueTtl(
        idempotentKey.toString(),
        JSON.stringify(response),
        86400
      );

      res.status(201).json(response);
    } catch (err) {
      // return res.status(500).send({
      //   status: "error",
      //   message: err.message || `error creating new note`,
      // });
      return next(err);
    }
  }
}
