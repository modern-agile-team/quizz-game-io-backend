import { Account } from '@module/account/entities/account.entity';
import { AccountOrmEntity } from '@module/account/repositories/account/account.orm-entity';

import { BaseMapper } from '@common/base/base.mapper';

export class AccountMapper extends BaseMapper {
  static toEntity(raw: AccountOrmEntity): Account {
    return new Account({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        role: raw.role,
        signInType: raw.signInType,
        username: raw.username,
        password: raw.password,
      },
    });
  }

  static toPersistence(entity: Account): AccountOrmEntity {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      role: entity.props.role,
      signInType: entity.props.signInType,
      username: entity.props.username,
      password: entity.props.password,
    };
  }
}
