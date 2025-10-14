import { NicknameSourceDtoAssembler } from '@module/nickname-source/assemblers/nickname-source-dto.assembler';
import { NicknameSourceCollectionDto } from '@module/nickname-source/dto/nickname-source-collection.dto';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';

import { OffsetPage } from '@common/base/base.entity';

export class NicknameSourceCollectionDtoAssembler {
  static convertToDto(
    page: OffsetPage<NicknameSource>,
  ): NicknameSourceCollectionDto {
    const dto = new NicknameSourceCollectionDto();

    dto.data = page.data.map(NicknameSourceDtoAssembler.convertToDto);
    dto.currentPage = page.currentPage;
    dto.perPage = page.perPage;
    dto.totalCount = page.totalCount;
    dto.totalPages = page.totalPages;

    return dto;
  }
}
