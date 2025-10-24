import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { UpdateQuizImageCommand } from '@module/quiz-image/use-cases/update-quiz-image/update-quiz-image.command';

import { generateEntityId } from '@common/base/base.entity';

export const UpdateQuizImageCommandFactory =
  Factory.define<UpdateQuizImageCommand>(
    UpdateQuizImageCommand.name,
    UpdateQuizImageCommand,
  ).attrs({
    quizImageId: () => generateEntityId(),
    name: () => faker.word.noun(),
    category: () => faker.word.noun(),
  });
