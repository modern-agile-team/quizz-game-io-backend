import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { QuizImageFactory } from '@module/quiz-image/entities/__spec__/quiz-image.factory';
import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { QuizImageRepository } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';

import { generateEntityId } from '@common/base/base.entity';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(QuizImageRepository, () => {
  let repository: QuizImageRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory()],
      providers: [
        {
          provide: QUIZ_IMAGE_REPOSITORY,
          useClass: QuizImageRepository,
        },
      ],
    }).compile();

    repository = module.get<QuizImageRepositoryPort>(QUIZ_IMAGE_REPOSITORY);
  });

  describe(QuizImageRepository.prototype.findOneById, () => {
    let quizImageId: string;

    beforeEach(() => {
      quizImageId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let quizImage: QuizImage;

      beforeEach(async () => {
        quizImage = await repository.insert(
          QuizImageFactory.build({ id: quizImageId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(quizImageId)).resolves.toEqual(
            quizImage,
          );
        });
      });
    });
  });

  describe(QuizImageRepository.prototype.findByFileNames, () => {
    let quizImages: QuizImage[];

    beforeEach(async () => {
      quizImages = await Promise.all(
        [
          QuizImageFactory.build({ fileName: faker.string.nanoid() }),
          QuizImageFactory.build({ fileName: faker.string.nanoid() }),
        ].map((quizImage) => repository.insert(quizImage)),
      );
    });

    describe('파일명 목록과 일치하는 리소스가 존재하는 경우', () => {
      it('리소스들이 반환돼야한다.', async () => {
        await expect(
          repository.findByFileNames(
            quizImages.map((quizImage) => quizImage.fileName),
          ),
        ).resolves.toEqual(
          expect.arrayContaining([
            expect.objectContaining({ fileName: quizImages[0].fileName }),
            expect.objectContaining({ fileName: quizImages[1].fileName }),
          ]),
        );
      });
    });
  });

  describe(QuizImageRepository.prototype.findAllOffsetPaginated, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let quizImages: QuizImage[];

    beforeEach(async () => {
      quizImages = await Promise.all(
        QuizImageFactory.buildList(5).map((quizImage) =>
          repository.insert(quizImage),
        ),
      );
    });

    describe('페이지를 조회하면', () => {
      it('페이지가 반환되어야한다.', async () => {
        await expect(
          repository.findAllOffsetPaginated({
            pageInfo: { offset: 0, limit: 2 },
          }),
        ).resolves.toEqual({
          data: expect.toSatisfyAll(
            (quizImage: unknown) => quizImage instanceof QuizImage,
          ),
          limit: expect.any(Number),
          offset: expect.any(Number),
          totalCount: expect.any(Number),
        });
      });
    });
  });
});
