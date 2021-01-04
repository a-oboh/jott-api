import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import redis from "redis";
import { promisifyAll } from "bluebird";

import { currentConfig as config } from "./config/index";
import { createConnection } from "typeorm";
import { handleError } from "./helpers/httpError";

import { authRouter } from "../src/routes/index";

dotenv.config();

const app = express();
const PORT = config.app.port || 8030;
const REDIS_PORT = config.app.redisPort || 6379;

async function connectDb() {
  try {
    await createConnection().then(async (connection) => {
      console.log("Database connected");
    });
  } catch (error) {
    console.log(error);
  }
}

promisifyAll(redis);

const redisClient = redis.createClient();

app.use("/api/v1/auth", authRouter);

// parse requests of content-type: application/json
app.use(express.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//app-wide custom error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});

app.get("/", (req: Request, res: Response) => res.send("<h1>q-note v1.0 🤙🏽 🤙🏽</h1>"));

connectDb();

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

export { redisClient, app };
