import dotenv from "dotenv";
import { conf } from ".";

dotenv.config();

const defaultConfig: conf = {
  app: {
    port: process.env.PORT,
    redisPort: parseInt(process.env.REDIS_PORT as string),
    redisHost: process.env.REDIS_HOST as string,
    jwtLife: process.env.JWT_LIFE,
  },
  db: {
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_USER,
    PASSWORD: process.env.MYSQL_PASSWORD,
    PORT: process.env.MYSQL_PORT,
    DB: process.env.MYSQL_DATABASE,
  },
};

export default defaultConfig;
