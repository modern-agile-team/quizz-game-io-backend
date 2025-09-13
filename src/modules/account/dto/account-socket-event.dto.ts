import { ApiProperty } from '@nestjs/swagger';

export class AccountSocketEventDto {
  @ApiProperty()
  accountId: string;

  @ApiProperty()
  nickname: string;
}
