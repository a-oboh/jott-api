/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");

dotenv.config();

const connectionConfig = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
};

const devConfig = {
  ...connectionConfig,
  name: "development",
  database: process.env.DB,
  // synchronize: true,
  logging: true,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
    subscribersDir: "src/subscriber",
  },
};

const prodConfig = {
  ...connectionConfig,
  name: "production",
  database: process.env.DB,
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

const testConfig = {
  ...connectionConfig,
  name: "test",
  database: process.env.TEST_DB,
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
    subscribersDir: "src/subscriber",
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
      return devConfig;
  }
};

const config = getConfig();

// console.log(config);

module.exports = config;
