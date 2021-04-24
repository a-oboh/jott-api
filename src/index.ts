import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import redis from "redis";
import { promisifyAll } from "bluebird";

import { currentConfig as config } from "./config/index";
import { createConnection } from "typeorm";
import { handleError, HttpError } from "./util/httpError";

import { authRouter, noteRouter, folderRouter } from "./routes/routeIndex";
import { expressLogger, logger } from "util/logger";
import { createTypeOrmConnection } from "util/typeOrmConnection";

dotenv.config();

const app: Application = express();
const PORT = config.app.port || 8030;
const REDIS_PORT = config.app.redisPort || 6379;

async function connectDb() {
  try {
    if (process.env.NODE_ENV == "development") {
      await createTypeOrmConnection().then(
        async (conn) => await conn.runMigrations()
      );
      logger.debug("Database connected");
    }

    if (process.env.NODE_ENV == "test") {
      await createTypeOrmConnection();
      // .then(async (conn) => await conn.runMigrations());
      logger.debug("Test database connected");
    }
  } catch (error) {
    logger.error(error);
  }
}

promisifyAll(redis);

const redisClient = redis.createClient({ port: REDIS_PORT });

connectDb();

// parse requests of content-type: application/json
app.use(express.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) =>
  res.send("<h1>q-note v1.0 🤙🏽 🤙🏽</h1>")
);

app.get("/api/v1/error", (req, res) => {
  throw new HttpError("Internal server error", 400);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/note", noteRouter);
app.use("/api/v1/folder", folderRouter);

//app-wide custom error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  handleError(error, res);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    // console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
}

export { redisClient, app };
