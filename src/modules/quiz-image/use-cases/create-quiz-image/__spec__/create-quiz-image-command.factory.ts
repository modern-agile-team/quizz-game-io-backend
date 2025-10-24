import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreateQuizImageCommand } from '@module/quiz-image/use-cases/create-quiz-image/create-quiz-image.command';

export const CreateQuizImageCommandFactory =
  Factory.define<CreateQuizImageCommand>(
    CreateQuizImageCommand.name,
    CreateQuizImageCommand,
  ).attrs({
    category: () => faker.word.verb(),
    buffer: () => Buffer.from(faker.string.nanoid()),
    originalFileName: () => faker.string.nanoid(),
    extension: () => faker.word.verb(),
    contentLength: () => faker.string.numeric(),
    width: () => faker.number.int({ min: 100, max: 1000 }),
    height: () => faker.number.int({ min: 100, max: 1000 }),
  });
