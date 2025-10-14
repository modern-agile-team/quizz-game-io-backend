import { Factory } from 'rosie';

import { GetNicknameSourceQuery } from '@module/nickname-source/use-cases/get-source/get-source.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetNicknameSourceQueryFactory =
  Factory.define<GetNicknameSourceQuery>(
    GetNicknameSourceQuery.name,
    GetNicknameSourceQuery,
  ).attrs({
    nicknameSourceId: () => generateEntityId(),
  });
