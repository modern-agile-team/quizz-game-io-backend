import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { SocialProvider } from '@module/account/entities/account.entity';
import { GetAccountBySocialIdQuery } from '@module/account/use-cases/get-account-by-social-id/get-account-by-social-id.query';

export const GetAccountBySocialIdQueryFactory =
  Factory.define<GetAccountBySocialIdQuery>(
    GetAccountBySocialIdQuery.name,
    GetAccountBySocialIdQuery,
  ).attrs({
    provider: () => faker.helpers.enumValue(SocialProvider),
    providerUid: () => faker.string.nanoid(),
  });
