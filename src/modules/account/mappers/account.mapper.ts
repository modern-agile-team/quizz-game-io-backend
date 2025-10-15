import {
  Account,
  AccountRole,
  SignInType,
  SocialProvider,
} from '@module/account/entities/account.entity';
import { AccountRaw } from '@module/account/repositories/account/account.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class AccountMapper extends BaseMapper {
  static toEntity(raw: AccountRaw): Account {
    return new Account({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        role: AccountRole[raw.role],
        signInType: SignInType[raw.signInType],
        socialProvider: raw.socialProvider
          ? SocialProvider[raw.socialProvider]
          : undefined,
        socialProviderUid: raw.socialProviderUid ?? undefined,
        username: raw.username ?? undefined,
        password: raw.password ?? undefined,
        nickname: raw.nickname,
        enteredAt: raw.lastEnteredAt ?? undefined,
        leftAt: raw.lastLeftAt ?? undefined,
        isActive: raw.isActive,
        lastSignedInAt: raw.lastSignedInAt ?? undefined,
      },
    });
  }

  static toPersistence(entity: Account): AccountRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      role: entity.props.role,
      signInType: entity.props.signInType,
      socialProvider: entity.socialProvider ?? null,
      socialProviderUid: entity.socialProviderUid ?? null,
      username: entity.props.username ?? null,
      password: entity.props.password ?? null,
      nickname: entity.props.nickname,
      lastEnteredAt: entity.props.enteredAt ?? null,
      lastSignedInAt: entity.props.lastSignedInAt ?? null,
      lastLeftAt: entity.props.leftAt ?? null,
      isActive: entity.props.isActive,
    };
  }
}
