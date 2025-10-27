import { BaseError } from '@common/base/base.error';

export class QuizImageInUsedError extends BaseError {
  static CODE = 'QUIZ_IMAGE.IN_USED';

  constructor(message?: string) {
    super(message ?? 'quiz image is in used', QuizImageInUsedError.CODE);
  }
}
