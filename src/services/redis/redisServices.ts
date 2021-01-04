import { promisifyAll } from "bluebird";
const { promisify } = require("util");
import redis from "redis";
import { redisClient as client } from "../../app";

export class RedisService {
  constructor() {}

  setAsync = promisify(client.set).bind(client);
  setExAsync = promisify(client.setex).bind(client);
  getAsync = promisify(client.get).bind(client);

  async setValue(key: string, val: string) {
    // promisifyAll(client);
    const result = await this.setAsync(key, val);
    return result;
  }

  async setTtlValue(key: string, val: string, ttl: number) { 
    // promisifyAll(client);
    const result = await this.setExAsync(key, ttl, val);
    return result;
  }

  getValue(key: string) {
    const value = this.getAsync(key);

    return value;
  }
}
