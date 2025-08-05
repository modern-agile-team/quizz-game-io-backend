import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

import { IActiveAccountStore } from '@module/account/stores/active-account/active-account.store.interface';

import {
  CACHE_CLIENT,
  ICacheClient,
} from '@shared/cache/cache.client.interface';

@Injectable()
export class ActiveAccountStore
  implements IActiveAccountStore, OnApplicationBootstrap
{
  private readonly logger = new Logger(ActiveAccountStore.name);
  private readonly CACHE_KEY = 'active_account_count';

  constructor(
    @Inject(CACHE_CLIENT) private readonly cacheClient: ICacheClient<number>,
  ) {}

  async onApplicationBootstrap() {
    const cache = await this.cacheClient.get(this.CACHE_KEY);

    if (cache !== undefined) {
      return;
    }

    await this.cacheClient.set(this.CACHE_KEY, 0);
  }

  async get(): Promise<number> {
    return Number(await this.cacheClient.get(this.CACHE_KEY));
  }

  async increment(): Promise<number> {
    return await this.cacheClient.increment(this.CACHE_KEY);
  }

  async decrement(): Promise<number> {
    const currentCount = await this.cacheClient.get(this.CACHE_KEY);
    if (currentCount === undefined || currentCount <= 0) {
      this.logger.warn(
        'Attempted to decrement active account count below zero.',
      );
      return 0;
    }

    return await this.cacheClient.decrement(this.CACHE_KEY);
  }
}
