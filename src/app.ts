import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import config from "./config/index";

dotenv.config();

const app = express();
const PORT = config.app.port;

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("<h1>q-note v1.0 🤙🏽 🤙🏽</h1>"));

app.listen(PORT || 8030, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
