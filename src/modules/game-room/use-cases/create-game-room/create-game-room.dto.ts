import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

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

  @ApiProperty({
    minimum: 10,
    maximum: 100,
  })
  @Max(100)
  @Min(10)
  @IsInt()
  quizzesCount: number;
}
