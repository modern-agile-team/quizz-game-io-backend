import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  QuizImage,
  QuizImageProps,
} from '@module/quiz-image/entities/quiz-image.entity';

import { generateEntityId } from '@common/base/base.entity';

export const QuizImageFactory = Factory.define<QuizImage & QuizImageProps>(
  QuizImage.name,
)
  .attrs({
    id: () => generateEntityId(),
    category: () => faker.word.verb(),
    name: () => faker.string.nanoid(),
    originalFileName: () => faker.string.nanoid(),
    fileName: () => faker.string.nanoid(),
    extension: () => faker.word.verb(),
    contentLength: () => faker.string.numeric(),
    width: () => faker.number.int({ min: 100, max: 1000 }),
    height: () => faker.number.int({ min: 100, max: 1000 }),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new QuizImage({ id, createdAt, updatedAt, props }),
  );
