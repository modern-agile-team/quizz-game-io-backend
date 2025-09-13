import { ApiProperty } from '@nestjs/swagger';

export class ActiveAccountSocketEventDto {
  @ApiProperty()
  currentActiveAccountsCount: number;
}
