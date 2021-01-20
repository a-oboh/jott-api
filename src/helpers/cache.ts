import { RedisService } from "services/redis/redisServices";

const redisService = new RedisService();

const cacheRequest = async (key: string, response: string, ttl = 86400) => {
  
  await redisService.setValueTtl(key, JSON.stringify(response), ttl);
};

export { cacheRequest };
