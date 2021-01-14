import { promisifyAll } from "bluebird";
const { promisify } = require("util");
import redis from "redis";
import { currentConfig as config } from "../../config/index";
// import { redisClient } from "../../app";

export class RedisService {
  constructor() {}

  REDIS_PORT = config.app.redisPort || 6379;

  redisClient = redis.createClient({ port: this.REDIS_PORT });

  private setAsync = promisify(this.redisClient.set).bind(this.redisClient);
  private setExAsync = promisify(this.redisClient.setex).bind(this.redisClient);
  private getAsync = promisify(this.redisClient.get).bind(this.redisClient);

  async setValue(key: string, val: string) {
    // promisifyAll(client);
    const result = await this.setAsync(key, val);
    return result;
  }

  async setValueTtl(key: string, val: string, ttl: number) {
    // promisifyAll(client);
    const result = await this.setExAsync(key, ttl, val);
    return result;
  }

  getValue(key: string) {
    const value = this.getAsync(key);

    return value;
  }
}
