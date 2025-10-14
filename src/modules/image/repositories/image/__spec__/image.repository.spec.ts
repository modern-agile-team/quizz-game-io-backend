import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ImageFactory } from '@module/image/entities/__spec__/image.factory';
import { Image } from '@module/image/entities/image.entity';
import { ImageRepository } from '@module/image/repositories/image/image.repository';
import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';

import { generateEntityId } from '@common/base/base.entity';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(ImageRepository, () => {
  let repository: ImageRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory()],
      providers: [
        {
          provide: IMAGE_REPOSITORY,
          useClass: ImageRepository,
        },
      ],
    }).compile();

    repository = module.get<ImageRepositoryPort>(IMAGE_REPOSITORY);
  });

  describe(ImageRepository.prototype.findOneById, () => {
    let imageId: string;

    beforeEach(() => {
      imageId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let image: Image;

      beforeEach(async () => {
        image = await repository.insert(ImageFactory.build({ id: imageId }));
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(imageId)).resolves.toEqual(image);
        });
      });
    });
  });

  describe(ImageRepository.prototype.findByFileNames, () => {
    let images: Image[];

    beforeEach(async () => {
      images = await Promise.all(
        [
          ImageFactory.build({ fileName: faker.string.nanoid() }),
          ImageFactory.build({ fileName: faker.string.nanoid() }),
        ].map((image) => repository.insert(image)),
      );
    });

    describe('파일명 목록과 일치하는 리소스가 존재하는 경우', () => {
      it('리소스들이 반환돼야한다.', async () => {
        await expect(
          repository.findByFileNames(images.map((image) => image.fileName)),
        ).resolves.toEqual([
          expect.objectContaining({ fileName: images[0].fileName }),
          expect.objectContaining({ fileName: images[1].fileName }),
        ]);
      });
    });
  });

  describe(ImageRepository.prototype.findAllOffsetPaginated, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let images: Image[];

    beforeEach(async () => {
      images = await Promise.all(
        ImageFactory.buildList(5).map((image) => repository.insert(image)),
      );
    });

    describe('페이지를 조회하면', () => {
      it('페이지가 반환되어야한다.', async () => {
        await expect(
          repository.findAllOffsetPaginated({
            pageInfo: { offset: 0, limit: 2 },
          }),
        ).resolves.toEqual({
          data: expect.toSatisfyAll((image: unknown) => image instanceof Image),
          limit: expect.any(Number),
          offset: expect.any(Number),
          totalCount: expect.any(Number),
        });
      });
    });
  });
});
