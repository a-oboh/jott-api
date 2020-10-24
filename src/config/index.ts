import _ from "lodash";
import defaultConfig from "./default";
import testConfig from "./test";
import prodConfig from "./prod";

interface conf {
  app: { port?: string };
  db: {
    HOST: string;
    USER?: string;
    PASSWORD?: string;
    PORT?: string;
    DB: string;
  };
}

function getConfig(): conf {
  switch (process.env.NODE_ENV) {
    case "test":
      return _.merge({}, defaultConfig, testConfig);
    case "production":
      return _.merge({}, defaultConfig, prodConfig);
    default:
      return _.merge({}, defaultConfig);
  }
}

let currentConfig: conf = getConfig();

export default currentConfig;
