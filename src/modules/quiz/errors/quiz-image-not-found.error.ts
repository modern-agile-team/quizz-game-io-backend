import { BaseError } from '@common/base/base.error';

export class QuizImageNotFoundError extends BaseError {
  static CODE: string = 'QUIZ.IMAGE_NOT_FOUND';

  constructor(message?: string) {
    super(message ?? 'Quiz image not found', QuizImageNotFoundError.CODE);
  }
}
