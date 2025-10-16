import { ApiProperty } from '@nestjs/swagger';

export class ActiveAccountCountDto {
  @ApiProperty()
  count: number;

  constructor(count: number) {
    this.count = count;
  }
}
