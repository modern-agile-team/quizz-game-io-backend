import { BaseError } from '@common/base/base.error';

export class ImageNotFoundError extends BaseError {
  static CODE: string = 'IMAGE.NOT_FOUND';

  constructor(message?: string) {
    super(message ?? 'Image not found', ImageNotFoundError.CODE);
  }
}
