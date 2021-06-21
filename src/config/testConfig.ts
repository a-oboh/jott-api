import dotenv from "dotenv";
import { conf } from ".";

dotenv.config();

const testConfig: conf = {
  app: {
    redisPort: parseInt(process.env.REDIS_PORT as string),
    redisHost: "redis-mock",
    jwtLife: process.env.JWT_LIFE,
  },
  db: {
    DB: process.env.TEST_DB,
  },
};
export default testConfig;
