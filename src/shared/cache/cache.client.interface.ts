export const CACHE_CLIENT = Symbol('CACHE_CLIENT');

export interface ICacheClient<T> {
  get(key: string): Promise<T | undefined>;

  set(key: string, value: T, ttl?: number): Promise<T>;

  increment(key: string): Promise<number>;

  decrement(key: string): Promise<number>;

  del(key: string): Promise<void>;
}
