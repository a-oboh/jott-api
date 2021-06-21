/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");

dotenv.config();

const rootDir = process.env.NODE_ENV == "production" ? "dist" : "src";

const connectionConfig = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const defaultConfig = {
  ...connectionConfig,
  name: "default",
  synchronize: false,
  logging: false,
  entities: [rootDir + "/entity/**/*{.ts,.js}"],
  migrations: [rootDir + "/migrations/**/*{.ts,.js}"],
  cli: {
    entitiesDir: rootDir + "/entity",
    migrationsDir: rootDir + "/migrations",
  },
};

const devConfig = {
  ...connectionConfig,
  name: "development",
  synchronize: false,
  logging: false,
  entities: ["src/entity/**/*{.ts,.js}"],
  migrations: ["src/migrations/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
  },
};

const prodConfig = {
  ...connectionConfig,
  synchronize: false,
  name: "production",
  logging: false,
  entities: ["dist/entity/**/*{.ts,.js}"],
  migrations: ["dist/migrations/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "dist/entity",
    migrationsDir: "dist/migrations",
  },
};

const testConfig = {
  ...connectionConfig,
  name: "test",
  host: process.env.MYSQL_HOST,
  database: process.env.TEST_DB,
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: ["src/entity/**/*{.ts,.js}", "dist/entity/**/*{.ts,.js}"],
  migrations: ["src/migrations/**/*{.ts,.js}"],
  // migrationsRun: true,
  cli: {
    entitiesDir:"src/entity",
    migrationsDir: "src/migrations",
  },
};

getConfig = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return devConfig;
    case "production":
      return prodConfig;
    case "test":
      return testConfig;
    default:
      return defaultConfig;
  }
};

const config = getConfig();

module.exports = config;
