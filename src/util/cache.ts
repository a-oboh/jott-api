import { RedisService } from "../services/redis/redisService";

const redisService = new RedisService();

const cacheRequest = async (key: string, response: string, ttl = 86400): Promise<any> => {
  
 return await redisService.setValueTtl(key, response, ttl);
};

export { cacheRequest };
