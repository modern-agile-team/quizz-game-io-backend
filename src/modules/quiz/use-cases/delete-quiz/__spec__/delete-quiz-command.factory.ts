import { Factory } from 'rosie';

import { DeleteQuizCommand } from '@module/quiz/use-cases/delete-quiz/delete-quiz.command';

import { generateEntityId } from '@common/base/base.entity';

export const DeleteQuizCommandFactory = Factory.define<DeleteQuizCommand>(
  DeleteQuizCommand.name,
  DeleteQuizCommand,
).attrs({
  quizId: () => generateEntityId(),
});
