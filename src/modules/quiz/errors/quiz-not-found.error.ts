import { BaseError } from '@common/base/base.error';

export class QuizNotFoundError extends BaseError {
  static CODE: string = 'QUIZ.NOT_FOUND';

  constructor(message?: string) {
    super(message ?? 'Quiz not found', QuizNotFoundError.CODE);
  }
}
