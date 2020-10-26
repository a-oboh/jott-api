const dotenv = require("dotenv");

dotenv.config();

const connectionConfig = {
  name: "default",
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.DB,
};

const devConfig = {
  ...connectionConfig,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.{ts, js}"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};

const prodConfig = {
  ...connectionConfig,
  synchronize: true,
  logging: false,
  entities: ["dist/entity/**/*.js"],
  migrations: ["dist/migration/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
  cli: {
    entitiesDir: "dist/entity",
    migrationsDir: "dist/migration",
    subscribersDir: "dist/subscriber",
  },
};

getConfig = () => {
  switch (process.env.NODE_ENV) {
    case "dev":
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
