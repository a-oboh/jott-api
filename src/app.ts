import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import config from "./config/index";
import { createConnection } from "typeorm";
import { handleError } from "./helpers/httpError";

import { authRouter } from "../src/routes/index";

dotenv.config();

const app = express();
const PORT = config.app.port;

async function connectDb() {
  try {
    await createConnection().then(async (connection) => {
      console.log("Database connected");
    });
  } catch (error) {
    console.log(error);
  }
}

app.use("/api/v1/auth", authRouter);

// parse requests of content-type: application/json
app.use(express.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//app-wide custom error handler
app.use((err, req, res, next) => {
  handleError(err, res);
});

app.get("/", (req, res) => res.send("<h1>q-note v1.0 🤙🏽 🤙🏽</h1>"));

connectDb();

app.listen(PORT || 8030, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
