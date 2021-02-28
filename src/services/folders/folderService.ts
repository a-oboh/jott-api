import { Folder } from "entity/folder";
import { User } from "entity/user";
import { HttpError } from "helpers/httpError";
import { getRepository, Repository } from "typeorm";

export class FolderService {
  constructor() {
    this.init();
  }

  private folderRepo: Repository<Folder>;

  private init = async () => {
    this.folderRepo = await getRepository(Folder);
  };

  private findFolderById = async (id: string) => {
    try {
      const folder = await this.folderRepo.findOne(id);

      if (!folder) {
        throw new HttpError(`folder with id ${id} not found`, 404);
      }

      return folder;
    } catch (e) {
      throw new HttpError(e, 500);
    }
  };

  getFolderById = async (id: string) => {
    const folder = await this.findFolderById(id);

    return folder;
  };

  getFolderByOwner = (owner: User) => {
    try {
      const folders = this.folderRepo.find({ owner });

      if (!folders) {
        throw new HttpError(`note for user ${owner.id} not found`, 404);
      }

      return folders;
    } catch (e) {
      throw new HttpError(e);
    }
  };

  createFolder = async (data: Folder) => {
    try {
      const folders = this.folderRepo.create(data);

      const newFolder = this.folderRepo.save(folders);

      return (newFolder as unknown) as Folder;
    } catch (e) {
      throw new HttpError(e.message, 500);
    }
  };

  updateFolder = async (data: Folder) => {
    try {
      const newFolder = this.folderRepo.save(data);

      return (newFolder as unknown) as Folder;
    } catch (e) {
      throw new HttpError(e.message, 500);
    }
  };

  deleteNote = (id: string) => {
    // const noteToRemove = await this.findNoteById(id);

    return this.folderRepo.softDelete(id);
  };

  restoreNote = (id: string) => {
    // const noteToRestore = await this.findNoteById(id);

    return this.folderRepo.restore(id);
  };
}
