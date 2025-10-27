import { BaseError } from '@common/base/base.error';

export class InvalidAssetUrlError extends BaseError {
  static CODE: string = 'ASSET.INVALID_ASSET_URL';

  constructor() {
    super('Invalid asset url', InvalidAssetUrlError.CODE);
  }
}
