import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { ListAccountsQuery } from '@module/account/use-cases/list-accounts/list-accounts.query';

export const ListAccountsQueryFactory = Factory.define<ListAccountsQuery>(
  ListAccountsQuery.name,
  ListAccountsQuery,
).attrs({
  isActive: () => faker.datatype.boolean(),
});
