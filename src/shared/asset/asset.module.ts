import { DynamicModule, Module } from '@nestjs/common';

import { AppConfigModule } from '@common/app-config/app-config.module';

import {
  ASSET_URL_CODEC_OPTIONS,
  ASSET_URL_CODEC_PORT,
  AssetUrlCodecOptions,
} from '@shared/asset/asset-url-codec.port';
import { AssetUrlCodec } from '@shared/asset/asset-url.codec';

@Module({})
export class AssetModule {
  static register(options: AssetUrlCodecOptions): DynamicModule {
    return {
      module: AssetModule,
      imports: [AppConfigModule],
      providers: [
        {
          provide: ASSET_URL_CODEC_OPTIONS,
          useValue: options,
        },
        {
          provide: ASSET_URL_CODEC_PORT,
          useClass: AssetUrlCodec,
        },
      ],
      exports: [ASSET_URL_CODEC_PORT],
    };
  }
}
