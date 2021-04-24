import request from "supertest";
import { app } from "index";
jest.useFakeTimers()

// beforeAll(async () => {
//   // await createTypeOrmConnection();
// });

describe("server checks", () => {
  it("server is created without errors", async () => {
    const result = await request(app).get("/").send();

    expect(result.status).toBe(200);
  });
});
