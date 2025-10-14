import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { ListNicknameSourcesQuery } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.query';

export const ListNicknameSourcesQueryFactory =
  Factory.define<ListNicknameSourcesQuery>(
    ListNicknameSourcesQuery.name,
    ListNicknameSourcesQuery,
  ).attrs({
    page: () => faker.number.int({ min: 1, max: 10 }),
    perPage: () => faker.number.int({ min: 1, max: 50 }),
  });
