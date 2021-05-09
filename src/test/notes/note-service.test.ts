import request from "supertest";
import { app } from "index";
import {
  closeConnection,
  createTestUsers,
  createTypeOrmConnection,
  cleanDb,
} from "../../util/typeOrmConnection";
import { RouteEnum } from "../../util/routeEnum";
import { createConnection, getConnectionOptions } from "typeorm";

describe("note service test suite", () => {
  beforeAll(async () => {
    let retries = 5;

    while (retries) {
      try {
        // await createTypeOrmConnection()
        const connOptions = await getConnectionOptions(process.env.NODE_ENV);
        await createConnection({ ...connOptions, name: "default" }).then(
          async () => {
            await createTestUsers();
          }
        );
        break;
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
