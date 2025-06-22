import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from 'mikro-orm.config';
import { RequestContextModule } from 'nestjs-request-context';

import { AppConfigModule } from '@common/app-config/app-config.module';

import { LoggerModule } from '@shared/logger/logger.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    RequestContextModule,
    AppConfigModule,
    LoggerModule,
    MikroOrmModule.forRoot(mikroOrmConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
