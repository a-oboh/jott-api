import request from "supertest";
import { app } from "app";
import {
  closeConnection,
  createTestUsers,
  createTypeOrmConnection,
  cleanDb,
} from "../../util/typeOrmConnection";
import { RouteEnum } from "../../util/routeEnum";
import { createConnection, getConnectionOptions } from "typeorm";
import { Note } from "entity/note";
import { NoteService } from "services/notes/noteService";

describe("note service test suite", () => {
  const noteSvc: NoteService = new NoteService();
  const mockNote = new Note();
  
  beforeAll(async () => {
    let retries = 1;

    while (retries) {
      try {
        // await createTypeOrmConnection()
        const connOptions = await getConnectionOptions("test");
        await createConnection({ ...connOptions, name: "default" }).then(
          async () => {
            await createTestUsers();
          }
        );
        // break;
      } catch (e) {
        console.log(e);
      }

      retries--;
    }
  });

  afterAll(async () => {
    await cleanDb();
    await closeConnection();
  });

  test("should get a single note from note service", async () => {
    noteSvc.getNoteById = jest.fn().mockReturnValue(mockNote);

    expect(noteSvc.getNoteById("id")).toBe(mockNote);
    expect(noteSvc.getNoteById).toHaveBeenCalledWith("id");
  });


  it("should create a new note [POST]", async () => {
    await request(app)
      .post(`${RouteEnum.AuthRoute}/login`)
      .send({ email: "user@test.com", password: "secret" })
      .then(async (login) => {
        await request(app)
          .post(`${RouteEnum.NoteRoute}/create-note`)
          .set("Authorization", "Bearer " + login.body.data.access_token)
          .set({ "x-idempotent-key": "a1" })
          .send({
            title: "test note",
            content: "# h1 Heading 5! 8-)",
          })
          .then((result) => {
            expect([201, 304]).toContain(result.status);
            // expect(result.status).toBe(201);
          });
      });
  });
});
