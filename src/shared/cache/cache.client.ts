import { OnModuleDestroy } from '@nestjs/common';

import Redis from 'ioredis';

import { ICacheClient } from '@shared/cache/cache.client.interface';

export class CacheClient<T> implements ICacheClient<T>, OnModuleDestroy {
  constructor(private readonly ioRedis: Redis) {}

  async onModuleDestroy() {
    await this.ioRedis.quit();
  }

  async get(key: string): Promise<T | undefined> {
    const value = await this.ioRedis.get(key);

    if (value === null) {
      return;
    }

    return JSON.parse(value) as T;
  }

  async set(key: string, value: T, ttl?: number): Promise<T> {
    if (ttl === undefined) {
      await this.ioRedis.set(key, JSON.stringify(value));
    } else {
      await this.ioRedis.set(key, JSON.stringify(value), 'EX', ttl);
    }

    const result = await this.ioRedis.get(key);

    return JSON.parse(result as any) as T;
  }

  async increment(key: string): Promise<number> {
    const result = await this.ioRedis.incr(key);

    return Number(result);
  }

  async decrement(key: string): Promise<number> {
    const result = await this.ioRedis.decr(key);

    return Number(result);
  }

  async del(key: string): Promise<void> {
    await this.ioRedis.del(key);
  }
}
