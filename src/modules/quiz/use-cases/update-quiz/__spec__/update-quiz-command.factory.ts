import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { UpdateQuizCommand } from '@module/quiz/use-cases/update-quiz/update-quiz.command';

import { generateEntityId } from '@common/base/base.entity';

export const UpdateQuizCommandFactory = Factory.define<UpdateQuizCommand>(
  UpdateQuizCommand.name,
  UpdateQuizCommand,
).attrs({
  quizId: () => generateEntityId(),
  type: () => faker.word.noun(),
  answer: () => faker.word.noun(),
  question: () => faker.lorem.sentence(),
  imageUrl: () => process.env.AWS_S3_URL + '/images/' + faker.image.url(),
});
