import { ApiProperty } from '@nestjs/swagger';

import { AccountDto } from '@module/account/dto/account.dto';

export class AccountCollectionDto {
  @ApiProperty({
    type: [AccountDto],
  })
  data: AccountDto[];
}
