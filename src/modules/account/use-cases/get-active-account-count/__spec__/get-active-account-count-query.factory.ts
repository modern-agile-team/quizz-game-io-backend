import { Factory } from 'rosie';

import { GetActiveAccountCountQuery } from '@module/account/use-cases/get-active-account-count/get-active-account-count.query';

export const GetActiveAccountCountQueryFactory =
  Factory.define<GetActiveAccountCountQuery>(
    GetActiveAccountCountQuery.name,
    GetActiveAccountCountQuery,
  ).attrs({});
