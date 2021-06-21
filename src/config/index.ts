import _ from "lodash";
import defaultConfig from "./default";
import testConfig from "./testConfig";
import prodConfig from "./prod";

interface conf {
  app: {
    port?: string;
    env?: string;
    redisPort?: number;
    redisHost?: string;
    jwtLife?: string | number;
  };
  db: {
    HOST?: string;
    USER?: string;
    PASSWORD?: string;
    PORT?: string;
    DB?: string;
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

const currentConfig: conf = getConfig();

export { currentConfig, conf };
