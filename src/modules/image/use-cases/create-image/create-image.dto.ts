import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class CreateImageDto {
  @ApiProperty({
    description: 'image file',
    required: true,
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(1e7) // 10MB
  file: MemoryStoredFile;

  @ApiProperty({
    description: 'image category',
    required: true,
  })
  @IsNotEmpty()
  category: string;
}
