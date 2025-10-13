import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreateImageCommand } from '@module/image/use-cases/create-image/create-image.command';

export const CreateImageCommandFactory = Factory.define<CreateImageCommand>(
  CreateImageCommand.name,
  CreateImageCommand,
).attrs({
  category: () => faker.word.verb(),
  buffer: () => Buffer.from(faker.string.nanoid()),
  originalFileName: () => faker.string.nanoid(),
  extension: () => faker.word.verb(),
  contentLength: () => faker.string.numeric(),
  width: () => faker.number.int({ min: 100, max: 1000 }),
  height: () => faker.number.int({ min: 100, max: 1000 }),
});
