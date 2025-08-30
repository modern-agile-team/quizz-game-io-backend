import { Inject, Injectable } from '@nestjs/common';

import {
  CACHE_CLIENT,
  ICacheClient,
} from '@shared/cache/cache.client.interface';

import { IAccountSocketIndexStore } from '@core/socket/index-store/account-socket-index.store.interface';

@Injectable()
export class AccountSocketIndexStore implements IAccountSocketIndexStore {
  constructor(
    @Inject(CACHE_CLIENT) private readonly cacheClient: ICacheClient<string>,
  ) {}

  async get(accountId: string): Promise<string | undefined> {
    return await this.cacheClient.get(this.getKey(accountId));
  }

  async set(accountId: string, socketId: string): Promise<void> {
    await this.cacheClient.set(this.getKey(accountId), socketId);
  }

  async del(accountId: string): Promise<void> {
    await this.cacheClient.del(this.getKey(accountId));
  }

  private getKey(accountId: string) {
    return `account:socket:${accountId}` as const;
  }
}
