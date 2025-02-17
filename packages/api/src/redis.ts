import _Redis from "ioredis";

import { env } from "./env";

class Redis extends _Redis {
  async compute(
    key: string,
    func: () => string | Buffer | number | Promise<string | Buffer | number>,
    expires?: number,
  ): Promise<string | null> {
    const exists = await this.exists(key);

    if (!exists) {
      try {
        const value = await func();
        if (expires) {
          await this.setex(key, expires, value);
        } else {
          await this.set(key, value);
        }

        return this.get(key);
      } catch (e) {
        console.error("Failed to set cache value: ", e);
        throw e;
      }
    } else {
      try {
        const value = await this.get(key);
        return value;
      } catch (e) {
        console.error("Failed to get cache value: ", e);
        throw e;
      }
    }
  }
}

const redisClient = () => {
  return new Redis(env.REDIS_URL);
};

export const redis = redisClient();
