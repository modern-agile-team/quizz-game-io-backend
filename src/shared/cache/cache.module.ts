import { Module } from '@nestjs/common';

import Redis from 'ioredis';

import { AppConfigService } from '@common/app-config/app-config.service';

import { CacheClient } from '@shared/cache/cache.client';
import { CACHE_CLIENT } from '@shared/cache/cache.client.interface';

@Module({
  providers: [
    {
      useFactory: (appConfigService: AppConfigService) => {
        const redis = new Redis(
          `${appConfigService.get<string>('REDIS_URL')}/1`,
        );

        return new CacheClient<unknown>(redis);
      },
      provide: CACHE_CLIENT,
      inject: [AppConfigService],
    },
  ],
  exports: [CACHE_CLIENT],
})
export class CacheModule {}
