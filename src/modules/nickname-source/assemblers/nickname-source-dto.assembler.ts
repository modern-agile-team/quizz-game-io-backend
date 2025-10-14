import { NicknameSourceDto } from '@module/nickname-source/dto/nickname-source.dto';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';

export class NicknameSourceDtoAssembler {
  static convertToDto(nicknameSource: NicknameSource): NicknameSourceDto {
    const dto = new NicknameSourceDto({
      id: nicknameSource.id,
      createdAt: nicknameSource.createdAt,
      updatedAt: nicknameSource.updatedAt,
    });

    dto.name = nicknameSource.name;
    dto.sequence = nicknameSource.sequence;
    dto.fullname = nicknameSource.fullname;

    return dto;
  }
}
