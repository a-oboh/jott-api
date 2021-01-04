import { User } from "entity/user/user";
import { getRepository } from "typeorm";
import { Note } from "../../entity/note/note";
import { HttpError } from "../../helpers/httpError";

export class NoteService {
  constructor() {}

  noteRepo = getRepository(Note);

  async findNoteById(id: string) {
    const note = await this.noteRepo.findOne(id);

    if (!note) {
      throw new HttpError(`note with id${id} not found`, 404);
    }

    return note;
  }

  async getNoteById(id: string) {
    // let noteRepo = getRepository(Note);

    const note = await this.findNoteById(id);

    if (note) {
      return note;
    }

    throw new HttpError(`note does not exist`, 404);
  }

  async getNoteByOwner(user: User) {
    const note = await this.noteRepo.find({ owner: user });

    return note;
  }

  async createNote(data: Note) {
    // let noteRepo = getRepository(Note);

    try {
      const note = this.noteRepo.create(data);

      const newNote = await this.noteRepo.save(note);

      return (newNote as unknown) as Note;
    } catch (e) {
      throw new HttpError(e.message, 500);
    }
  }

  async saveNote(data: Note) {
    // let noteRepo = getRepository(Note);

    try {
      const newNote = await this.noteRepo.save(data);

      return (newNote as unknown) as Note;
    } catch (e) {
      throw new HttpError(e.message, 500);
    }
  }

  async softDeleteNote(id: string) {
    // const noteToRemove = await this.findNoteById(id);

    return this.noteRepo.softDelete(id);
  }

  async restoreNote(id: string) {
    // const noteToRestore = await this.findNoteById(id);

    return this.noteRepo.restore(id);
  }
}
