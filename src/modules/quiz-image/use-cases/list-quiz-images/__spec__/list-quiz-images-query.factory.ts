import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { ListQuizImagesQuery } from '@module/quiz-image/use-cases/list-quiz-images/list-quiz-images.query';

export const ListQuizImagesQueryFactory = Factory.define<ListQuizImagesQuery>(
  ListQuizImagesQuery.name,
  ListQuizImagesQuery,
).attrs({
  category: () => faker.word.noun(),
  page: () => faker.number.int({ min: 1, max: 10 }),
  perPage: () => faker.number.int({ min: 1, max: 50 }),
});
