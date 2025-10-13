import { ImageDto } from '@module/image/dto/image.dto';
import { Image } from '@module/image/entities/image.entity';

export class ImageDtoAssembler {
  static convertToDto(image: Image): ImageDto {
    const dto = new ImageDto({
      id: image.id,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    });

    dto.category = image.category;
    dto.originalFileName = image.originalFileName;
    dto.imageUrl = image.imageUrl;
    dto.extension = image.extension;
    dto.contentType = image.contentType;
    dto.contentLength = Number(image.contentLength);
    dto.width = image.width;
    dto.height = image.height;

    return dto;
  }
}
