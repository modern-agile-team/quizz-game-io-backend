import { Module } from '@nestjs/common';

import { Logger, LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigModule } from '@common/app-config/app-config.module';
import { AppConfigService } from '@common/app-config/app-config.service';

export const LOGGER = Symbol('LOGGER');

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => {
        const IS_PRODUCTION = appConfigService.isProd();
        const LOGGER_LEVEL = appConfigService.get<string>(ENV_KEY.LOGGER_LEVEL);

        return {
          pinoHttp: {
            level: LOGGER_LEVEL,
            transport: IS_PRODUCTION
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    translateTime: 'SYS:HH:MM:ss.l o',
                    singleLine: true,
                    ignore: 'context,hostname',
                  },
                },
          },
        };
      },
      inject: [AppConfigService],
    }),
  ],
  providers: [
    {
      provide: LOGGER,
      useClass: Logger,
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}
