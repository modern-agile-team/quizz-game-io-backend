import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import Joi from 'joi';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        if (process.env.NODE_ENV === 'test') {
          return '.env.test';
        }
        return '.env';
      })(),
      validationSchema: Joi.object({
        [ENV_KEY.PORT]: Joi.number(),
        [ENV_KEY.NODE_ENV]: Joi.string().required(),
        [ENV_KEY.APP_STAGE]: Joi.string().required(),

        [ENV_KEY.DATABASE_URL]: Joi.string().required(),

        [ENV_KEY.REDIS_URL]: Joi.string().required(),

        [ENV_KEY.JWT_SECRET_KEY]: Joi.string().required(),
        [ENV_KEY.JWT_ISSUER]: Joi.string().required(),
        [ENV_KEY.JWT_ACCESS_TOKEN_EXPIRES_IN]: Joi.string().required(),

        [ENV_KEY.LOGGER_LEVEL]: Joi.string()
          .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
          .default('trace'),

        [ENV_KEY.AWS_S3_REGION]: Joi.string().required(),
        [ENV_KEY.AWS_S3_BUCKET_NAME]: Joi.string().required(),
        [ENV_KEY.AWS_S3_URL]: Joi.string().required(),
        [ENV_KEY.AWS_S3_ACCESS_KEY]: Joi.string().required(),
        [ENV_KEY.AWS_S3_SECRET_KEY]: Joi.string().required(),
        [ENV_KEY.AWS_S3_IMAGE_FILE_PATH]: Joi.string().required(),

        [ENV_KEY.OAUTH_ALLOW_REDIRECT_URLS]: Joi.string()
          .required()
          .custom((value) => value.split(',')),
        [ENV_KEY.OAUTH_DEFAULT_REDIRECT_URL]: Joi.string().required(),

        [ENV_KEY.GOOGLE_OAUTH_CLIENT_ID]: Joi.string().required(),
        [ENV_KEY.GOOGLE_OAUTH_CLIENT_SECRET]: Joi.string().required(),
        [ENV_KEY.GOOGLE_OAUTH_CALLBACK_URL]: Joi.string().required(),
        [ENV_KEY.GOOGLE_OAUTH_SCOPE]: Joi.string().required(),
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
