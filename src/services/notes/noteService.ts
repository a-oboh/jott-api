import { User } from "entity/user/user";
import { getRepository, Repository } from "typeorm";
import { Note } from "../../entity/note/note";
import { HttpError } from "../../helpers/httpError";

export class NoteService {
  constructor() {
    // this.noteRepo = getRepository(Note);
    this.noteRepo = getRepository(Note);
  }

  noteRepo: Repository<Note>;

  // private noteRepo: Repository<Note>;

  private async findNoteById(id: string) {
    let noteRepo = getRepository(Note);

    const note = await noteRepo.findOne(id);

    if (!note) {
      throw new HttpError(`note with id ${id} not found`, 404);
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

  async getSingleNote(user: User, noteId: string) {
    let noteRepo = getRepository(Note);

    try {
      if (!noteId) {
        throw new HttpError("no note id", 500);
      }

      const note = await noteRepo.findOneOrFail({ id: noteId, owner: user });

      return note;
    } catch (err) {
      throw new HttpError(err, 500);
    }
  }

  async getNotesByOwner(user: User) {
    let noteRepo = getRepository(Note);

    const notes = await noteRepo.find({ owner: user });

    return notes;
  }

  async createNote(data: Note) {
    let noteRepo = getRepository(Note);

    try {
      const note = noteRepo.create(data);

      const newNote = await noteRepo.save(note);

      return (newNote as unknown) as Note;
    } catch (e) {
      throw new HttpError(e.message, 500);
    }
  }

  async updateNote(data: Note) {
    let noteRepo = getRepository(Note);

    try {
      const newNote = await noteRepo.save(data);

      return (newNote as unknown) as Note;
    } catch (e) {
      throw new HttpError(e.message, 500);
    }
  }

  async softDeleteNote(id: string) {
    let noteRepo = getRepository(Note);
    // const noteToRemove = await this.findNoteById(id);

    return noteRepo.softDelete(id);
  }

  async restoreNote(id: string) {
    let noteRepo = getRepository(Note);
    // const noteToRestore = await this.findNoteById(id);

    return noteRepo.restore(id);
  }
}
