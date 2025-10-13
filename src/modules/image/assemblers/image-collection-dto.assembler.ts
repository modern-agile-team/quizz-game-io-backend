import { ImageDtoAssembler } from '@module/image/assemblers/image-dto.assembler';
import { ImageCollectionDto } from '@module/image/dto/image.collection.dto';
import { Image } from '@module/image/entities/image.entity';

import { OffsetPage } from '@common/base/base.entity';

export class ImageCollectionDtoAssembler {
  static convertToDto(page: OffsetPage<Image>): ImageCollectionDto {
    const dto = new ImageCollectionDto();

    dto.data = page.data.map(ImageDtoAssembler.convertToDto);
    dto.currentPage = page.currentPage;
    dto.perPage = page.perPage;
    dto.totalCount = page.totalCount;
    dto.totalPages = page.totalPages;

    return dto;
  }
}
