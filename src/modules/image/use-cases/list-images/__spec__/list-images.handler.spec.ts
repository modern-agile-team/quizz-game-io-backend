import { Test, TestingModule } from '@nestjs/testing';

import { ImageFactory } from '@module/image/entities/__spec__/image.factory';
import { Image } from '@module/image/entities/image.entity';
import { ImageRepositoryModule } from '@module/image/repositories/image/image.repository.module';
import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';
import { ListImagesQueryFactory } from '@module/image/use-cases/list-images/__spec__/list-images-query.factory';
import { ListImagesHandler } from '@module/image/use-cases/list-images/list-images.handler';
import { ListImagesQuery } from '@module/image/use-cases/list-images/list-images.query';

import { ClaModuleFactory } from '@common/factories/cls-module.factory';

describe(ListImagesHandler.name, () => {
  let handler: ListImagesHandler;

  let imageRepository: ImageRepositoryPort;

  let query: ListImagesQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClaModuleFactory(), ImageRepositoryModule],
      providers: [ListImagesHandler],
    }).compile();

    handler = module.get<ListImagesHandler>(ListImagesHandler);

    imageRepository = module.get<ImageRepositoryPort>(IMAGE_REPOSITORY);
  });

  beforeEach(() => {
    query = ListImagesQueryFactory.build();
  });

  describe('이미지의 페이지를 조회하면', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let images: Image[];

    beforeEach(async () => {
      images = await Promise.all(
        ImageFactory.buildList(5).map((image) => imageRepository.insert(image)),
      );
    });

    it('이미지의 페이지가 반환돼야한다.', async () => {
      const result = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result.data.length).toBeGreaterThanOrEqual(0);
      expect(result.currentPage).toBe(query.page ?? 1);
      expect(result.perPage).toBe(query.perPage ?? 20);
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
    });
  });
});
