import { Factory } from 'rosie';

import { DeleteQuizImageCommand } from '@module/quiz-image/use-cases/delete-quiz-image/delete-quiz-image.command';

import { generateEntityId } from '@common/base/base.entity';

export const DeleteQuizImageCommandFactory =
  Factory.define<DeleteQuizImageCommand>(
    DeleteQuizImageCommand.name,
    DeleteQuizImageCommand,
  ).attrs({
    quizImageId: () => generateEntityId(),
  });
