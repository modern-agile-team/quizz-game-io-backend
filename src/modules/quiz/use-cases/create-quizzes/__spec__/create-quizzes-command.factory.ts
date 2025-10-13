import { Factory } from 'rosie';

import { CreateQuizzesCommand } from '@module/quiz/use-cases/create-quizzes/create-quizzes.command';

export const CreateQuizzesCommandFactory = Factory.define<CreateQuizzesCommand>(
  CreateQuizzesCommand.name,
  CreateQuizzesCommand,
).attrs({
  props: () => [],
});
