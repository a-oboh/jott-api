/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");

dotenv.config();

const rootDir = process.env.NODE_ENV === "development" ? "src" : "dist";

const connectionConfig = {
  name: "default",
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const devConfig = {
  ...connectionConfig,
  synchronize: false,
  logging: false,
  entities: [__dirname + "/entity/**/*{.ts,.js}"],
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  cli: {
    entitiesDir: __dirname + "/entity",
    migrationsDir: __dirname + "migrations",
  },
};

const prodConfig = {
  ...connectionConfig,
  synchronize: false,
  logging: false,
  entities: ["dist/entity/**/*.js"],
  migrations: ["dist/migrations/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
  cli: {
    entitiesDir: "dist/entity",
    migrationsDir: "dist/migrations",
    subscribersDir: "dist/subscriber",
  },
};

getConfig = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return devConfig;
    case "production":
      return prodConfig;
    default:
      return devConfig;
  }
};

const config = getConfig();

// console.log(config);

module.exports = config;
