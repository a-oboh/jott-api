import dotenv from "dotenv";

dotenv.config();

let defaultConfig = {
  app: {
    port: process.env.PORT,
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
