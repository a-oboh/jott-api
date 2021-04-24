import request from "supertest";
import { app } from "index";
import {
  closeConnection,
  createTestUsers,
  createTypeOrmConnection,
} from "util/typeOrmConnection";
import { RouteEnum } from "util/routeEnum";
import { createConnection } from "typeorm";

describe("note service test suite", () => {
  beforeAll(async () => {
    return createConnection({
      type: "mysql",
      host: "127.0.0.1",
      port: "3306",
      username: "root",
      password: "",
      dropSchema: true,
      
     synchronize: true,
     logging: false
    });
    // await createTypeOrmConnection();
    await createTestUsers();
  });

  afterAll(async () => {
    await closeConnection();
  });

  it("should create a new note [POST]", async () => {
    const user = await request(app)
      .post(`${RouteEnum.AuthRoute}/login`)
      .send({ email: "user@test.com", password: "secret" });

    const result = await request(app)
      .post(`${RouteEnum.NoteRoute}/create-note`)
      .set("Authorization", "bearer " + user.body.token)
      .set({ "x-idempotent-key": "a1" })
      .send({
        title: "test note",
        content: "# h1 Heading 5! 8-)",
      });

    expect(result.status).toBe(200);
  });
});
