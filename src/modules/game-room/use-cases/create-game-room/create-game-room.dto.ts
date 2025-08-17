import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateGameRoomDto {
  @ApiProperty({
    description: '게임 방 제목',
    example: 'My Awesome Game Room',
    maxLength: 50,
    minLength: 1,
  })
  @Length(1, 50)
  @IsNotEmpty()
  @IsString()
  title: string;
}
