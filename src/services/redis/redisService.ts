import { HttpError } from "../../util/httpError";
import redis from "redis";
import { currentConfig as config } from "../../config/index";
import { promisify } from "util";
import { logger } from "../../util/logger";
// import { redisClient } from "../../app";

export class RedisService {
  REDIS_PORT = config.app.redisPort || 6379;
  REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";

  redisClient = redis.createClient({ host: this.REDIS_HOST, port: this.REDIS_PORT });

  private setAsync = promisify(this.redisClient.set).bind(this.redisClient);
  private setExAsync = promisify(this.redisClient.setex).bind(this.redisClient);
  private getAsync = promisify(this.redisClient.get).bind(this.redisClient);
  private deleteAsync = promisify(this.redisClient.del).bind(this.redisClient);

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

  async getValue(key: string) {
    const value = await this.getAsync(key);
    return value;
  }

  async deleteKey(key: string) {
    try {
      const value = await this.deleteAsync(key);

      logger.debug(value);

      return value;
    } catch (e) {
      throw new HttpError(e);
    }
  }
}
