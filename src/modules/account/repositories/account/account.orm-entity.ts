import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/postgresql';

import {
  AccountRole,
  SignInType,
} from '@module/account/entities/account.entity';

@Entity({ tableName: 'account' })
export class AccountOrmEntity {
  @PrimaryKey({ type: 'bigint' })
  id: bigint;

  @Enum({ items: () => AccountRole })
  role: AccountRole;

  @Enum({ items: () => SignInType })
  signInType: SignInType;

  @Property({ type: 'varchar', name: 'username', length: 20, unique: true })
  username: string;

  @Property({ type: 'varchar', name: 'password', length: 255, nullable: true })
  password: string;

  @Property({ type: 'datetime', name: 'created_at', defaultRaw: 'now()' })
  createdAt: Date;

  @Property({
    type: 'datetime',
    name: 'updated_at',
    defaultRaw: 'now()',
  })
  updatedAt: Date;
}
