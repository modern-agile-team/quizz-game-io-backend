import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { ListImagesQuery } from '@module/image/use-cases/list-images/list-images.query';

export const ListImagesQueryFactory = Factory.define<ListImagesQuery>(
  ListImagesQuery.name,
  ListImagesQuery,
).attrs({
  category: () => faker.word.noun(),
  page: () => faker.number.int({ min: 1, max: 10 }),
  perPage: () => faker.number.int({ min: 1, max: 50 }),
});
