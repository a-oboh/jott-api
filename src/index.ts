import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import redis from "redis";
import { promisifyAll } from "bluebird";

import { currentConfig as config } from "./config/index";
import { handleError, NotFoundError } from "./util/httpError";

import { authRouter, noteRouter, folderRouter } from "./routes/routeIndex";
import { logger } from "./util/logger";
import { createTypeOrmConnection } from "./util/typeOrmConnection";
import { app } from "app";

dotenv.config();

async function connectDb() {
  try {
    if (process.env.NODE_ENV == "development") {
      await createTypeOrmConnection().then(
        async (conn) => await conn.runMigrations()
      );
      logger.debug("Dev database connected");
    } else if (process.env.NODE_ENV == "test") {
      // await createTypeOrmConnection()
      // .then(
      //   async (conn) => await conn.runMigrations()
      // );
      logger.info("Test database connected");
    } else {
      await createTypeOrmConnection().then(
        async (conn) => await conn.runMigrations()
      );
      logger.debug("Database connected");
    }
  } catch (error) {
    logger.error(error);
  }
}

promisifyAll(redis);

// const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });

connectDb();

app;