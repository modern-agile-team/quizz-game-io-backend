import { Inject, Injectable } from '@nestjs/common';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

import {
  ASSET_URL_CODEC_OPTIONS,
  AssetUrlCodecOptions,
  AssetUrlCodecPort,
} from '@shared/asset/asset-url-codec.port';
import { InvalidAssetUrlError } from '@shared/asset/errors/invalid-asset-url.error';

@Injectable()
export class AssetUrlCodec implements AssetUrlCodecPort {
  private readonly BASE_ASSET_URL: string;

  constructor(
    @Inject(ASSET_URL_CODEC_OPTIONS)
    private readonly options: AssetUrlCodecOptions,
    private readonly appConfigService: AppConfigService,
  ) {
    const ASSET_FILE_PATHS = {
      quizImage: this.appConfigService.get<string>(
        ENV_KEY.AWS_S3_QUIZ_IMAGE_FILE_PATH,
      ),
    };

    this.BASE_ASSET_URL = `${this.appConfigService.get<string>(ENV_KEY.AWS_S3_URL)}/${ASSET_FILE_PATHS[this.options.category]}`;
  }

  buildUrl(fileName: string): string {
    return `${this.BASE_ASSET_URL}/${fileName}`;
  }

  parseUrl(url: string): string {
    if (this.isValidUrl(url) === false) {
      throw new InvalidAssetUrlError();
    }

    this.isValidUrl(url);

    return url.split('/').pop() as string;
  }

  isValidUrl(url: string): boolean {
    return url.startsWith(this.BASE_ASSET_URL);
  }
}
