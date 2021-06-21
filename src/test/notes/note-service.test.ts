import request from "supertest";
import { app } from "app";
import {
  closeConnection,
  createTestUsers,
  createTypeOrmConnection,
  cleanDb,
  connectTestDb,
} from "../../util/typeOrmConnection";
import { RouteEnum } from "../../util/routeEnum";
import { createConnection, getConnectionOptions } from "typeorm";
import { Note } from "entity/note";
import { NoteService } from "services/notes/noteService";
import { JwtService } from "services/auth/jwtService";
import { RedisService } from "services/redis/redisService";

describe("note service test suite", () => {
  const noteSvc: NoteService = new NoteService();
  const mockNote = new Note();

  let token: string;

  beforeAll(async () => {
    await connectTestDb().then(async () => {
      const jwtSvc = new JwtService();

      const user = await createTestUsers();

      token = jwtSvc.createToken({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    });
  });

  afterAll(async () => {
    await cleanDb();
    await closeConnection();
    new RedisService().close();
  });

  test("should get a single note from note service", async () => {
    noteSvc.getNoteById = jest.fn().mockReturnValue(mockNote);

    expect(noteSvc.getNoteById("id")).toBe(mockNote);
    expect(noteSvc.getNoteById).toHaveBeenCalledWith("id");
  });

  test("should create a new note [POST]", async () => {
    await request(app)
      .post(`${RouteEnum.NoteRoute}/create-note`)
      .set("Authorization", "Bearer " + token)
      .set({ "x-idempotent-key": "a1" })
      .send({
        title: "test note",
        content: "# h1 Heading 5! 8-)",
      })
      .then((result) => {
        // expect(result.status).toBe
        expect([201, 304]).toContain(result.status);
      });
  });
});
