import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Quiz, QuizProps } from '@module/quiz/entities/quiz.entity';

import { generateEntityId } from '@common/base/base.entity';

export const QuizFactory = Factory.define<Quiz & QuizProps>(Quiz.name)
  .attrs({
    id: () => generateEntityId(),
    type: () => faker.string.nanoid(),
    question: () => faker.lorem.sentence(),
    answer: () => faker.lorem.word(),
    imageFileName: () => faker.internet.url(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new Quiz({ id, createdAt, updatedAt, props }),
  );
