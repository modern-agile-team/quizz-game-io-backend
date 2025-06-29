import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { RequestContextModule } from 'nestjs-request-context';

import { AccountModule } from '@module/account/account.module';

import { AppConfigModule } from '@common/app-config/app-config.module';

import { LoggerModule } from '@shared/logger/logger.module';
import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    RequestContextModule,
    AppConfigModule,
    LoggerModule,
    PrismaModule,

    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
