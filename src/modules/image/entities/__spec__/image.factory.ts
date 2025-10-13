import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { Image, ImageProps } from '@module/image/entities/image.entity';

import { generateEntityId } from '@common/base/base.entity';

export const ImageFactory = Factory.define<Image & ImageProps>(Image.name)
  .attrs({
    id: () => generateEntityId(),
    category: () => faker.word.verb(),
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
      new Image({ id, createdAt, updatedAt, props }),
  );
