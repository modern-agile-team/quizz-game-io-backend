import { ENV_KEY } from '@common/app-config/app-config.constant';

import { InvalidAssetUrlError } from '@shared/asset/errors/invalid-asset-url.error';

export type AssetCategory = 'quizImage';

export class AssetUrlManager {
  private static readonly BASE_ASSET_URL = process.env[
    ENV_KEY.AWS_S3_URL
  ] as string;
  private static readonly BASE_ASSET_FILE_PATH: Record<AssetCategory, string> =
    {
      quizImage: process.env[ENV_KEY.AWS_S3_QUIZ_IMAGE_FILE_PATH] as string,
    };

  static fileNameToUrl(fileName: string, category: AssetCategory): string {
    return `${this.BASE_ASSET_URL}/${this.BASE_ASSET_FILE_PATH[category]}/${fileName}`;
  }

  static urlToFileName(url: string, category: AssetCategory): string {
    if (this.isValidUrl(url, category) === false) {
      throw new InvalidAssetUrlError();
    }

    return url.replace(
      `${this.BASE_ASSET_URL}/${this.BASE_ASSET_FILE_PATH[category]}/`,
      '',
    );
  }

  static isValidUrl(url: string, category: AssetCategory): boolean {
    return url.startsWith(
      `${this.BASE_ASSET_URL}/${this.BASE_ASSET_FILE_PATH[category]}`,
    );
  }
}
