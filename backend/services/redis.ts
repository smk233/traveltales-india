import { createClient } from 'redis';
import { config } from '../config/utils';

class InMemoryCache {
  private cache = new Map<string, { value: any; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
  }

  async set(key: string, value: string, options?: { EX?: number }): Promise<string | null> {
    const expiresAt = options?.EX ? Date.now() + options.EX * 1000 : undefined;
    this.cache.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.cache.delete(key) ? 1 : 0;
  }

  async keys(pattern: string): Promise<string[]> {
    const regexStr = pattern.replace(/\*/g, '.*');
    const regex = new RegExp(`^${regexStr}$`);
    const results: string[] = [];
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.cache.delete(key);
        continue;
      }
      if (regex.test(key)) {
        results.push(key);
      }
    }
    return results;
  }

  async flushAll(): Promise<string> {
    this.cache.clear();
    return 'OK';
  }
}

let redisClient: any;
let isConnected = false;
const inMemoryCache = new InMemoryCache();

if (config.NODE_ENV !== 'test') {
  redisClient = createClient({
    url: config.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          console.warn('Redis reconnection failed. Switching to in-memory fallback cache.');
          return false;
        }
        return Math.min(retries * 100, 3000);
      },
    },
  });

  redisClient.on('connect', () => {
    isConnected = true;
    console.log('Successfully connected to Redis server');
  });

  redisClient.on('error', (err: any) => {
    isConnected = false;
    console.error('Redis client error:', err.message);
  });

  redisClient.connect().catch((err: any) => {
    isConnected = false;
    console.warn('Could not connect to Redis server. Operating in in-memory fallback cache mode.');
  });
}

export const cacheService = {
  get: async (key: string): Promise<string | null> => {
    if (isConnected && redisClient) {
      try {
        return await redisClient.get(key);
      } catch (err) {
        console.error('Redis get error, falling back to memory:', err);
      }
    }
    return inMemoryCache.get(key);
  },

  set: async (key: string, value: string, options?: { EX?: number }): Promise<string | null> => {
    if (isConnected && redisClient) {
      try {
        return await redisClient.set(key, value, options);
      } catch (err) {
        console.error('Redis set error, falling back to memory:', err);
      }
    }
    return inMemoryCache.set(key, value, options);
  },

  del: async (key: string): Promise<number> => {
    if (isConnected && redisClient) {
      try {
        return await redisClient.del(key);
      } catch (err) {
        console.error('Redis del error, falling back to memory:', err);
      }
    }
    return inMemoryCache.del(key);
  },

  keys: async (pattern: string): Promise<string[]> => {
    if (isConnected && redisClient) {
      try {
        return await redisClient.keys(pattern);
      } catch (err) {
        console.error('Redis keys error, falling back to memory:', err);
      }
    }
    return inMemoryCache.keys(pattern);
  },

  flushAll: async (): Promise<string> => {
    if (isConnected && redisClient) {
      try {
        return await redisClient.flushAll();
      } catch (err) {
        console.error('Redis flushAll error, falling back to memory:', err);
      }
    }
    return inMemoryCache.flushAll();
  },

  invalidatePattern: async (pattern: string): Promise<void> => {
    try {
      const keys = await cacheService.keys(pattern);
      if (keys.length > 0) {
        await Promise.all(keys.map((key) => cacheService.del(key)));
      }
    } catch (err) {
      console.error(`Error invalidating pattern ${pattern}:`, err);
    }
  },
};
export default cacheService;
