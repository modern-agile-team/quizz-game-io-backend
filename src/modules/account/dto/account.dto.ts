import { ApiProperty } from '@nestjs/swagger';

import {
  AccountRole,
  SignInType,
} from '@module/account/entities/account.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class AccountDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Account role',
    example: AccountRole.admin,
  })
  role: AccountRole;

  @ApiProperty({
    description: 'Account sign in type',
    example: SignInType.username,
  })
  signInType: SignInType;
}
