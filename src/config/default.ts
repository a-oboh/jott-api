import dotenv from "dotenv";
import { conf } from ".";

dotenv.config();

let defaultConfig: conf = {
  app: {
    port: process.env.PORT,
    redisPort: parseInt(process.env.REDIS_PORT as string),
  },
  db: {
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_USER,
    PASSWORD: process.env.MYSQL_PASS,
    PORT: process.env.MYSQL_PORT,
    DB: process.env.MYSQL_DB,
  },
};

export default defaultConfig;
