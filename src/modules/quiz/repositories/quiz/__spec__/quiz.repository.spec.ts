import { Test, TestingModule } from '@nestjs/testing';

import { QuizFactory } from '@module/quiz/entities/__spec__/quiz.factory';
import { Quiz } from '@module/quiz/entities/quiz.entity';
import { QuizRepository } from '@module/quiz/repositories/quiz/quiz.repository';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';

import { generateEntityId } from '@common/base/base.entity';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(QuizRepository, () => {
  let repository: QuizRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory()],
      providers: [
        {
          provide: QUIZ_REPOSITORY,
          useClass: QuizRepository,
        },
      ],
    }).compile();

    repository = module.get<QuizRepositoryPort>(QUIZ_REPOSITORY);
  });

  describe(QuizRepository.prototype.findOneById, () => {
    let quizId: string;

    beforeEach(() => {
      quizId = generateEntityId();
    });

    describe('식별자와 일치하는 퀴즈가 존재하는 경우', () => {
      let quiz: Quiz;

      beforeEach(async () => {
        quiz = await repository.insert(QuizFactory.build({ id: quizId }));
      });

      it('해당 퀴즈를 반환해야 한다.', async () => {
        await expect(repository.findOneById(quizId)).resolves.toEqual(quiz);
      });
    });
  });

  describe(QuizRepository.prototype.insertMany, () => {
    let quizzes: Quiz[];

    beforeEach(() => {
      quizzes = QuizFactory.buildList(3);
    });

    describe('여러 퀴즈를 삽입하면', () => {
      it('퀴즈들이 삽입돼야 한다.', async () => {
        await repository.insertMany(quizzes);
        await Promise.all(
          quizzes.map(async (quiz) => {
            await expect(repository.findOneById(quiz.id)).resolves.toEqual(
              quiz,
            );
          }),
        );
      });
    });
  });

  describe(QuizRepository.prototype.findAll, () => {
    let quizzes: Quiz[];

    beforeEach(async () => {
      quizzes = await Promise.all(
        QuizFactory.buildList(3).map((quiz) => repository.insert(quiz)),
      );
    });

    describe('모든 퀴즈 목록을 조회하면', () => {
      it('모든 퀴즈 목록을 반환해야 한다.', async () => {
        await expect(repository.findAll()).resolves.toEqual(
          expect.arrayContaining(quizzes),
        );
      });
    });
  });

  describe(QuizRepository.prototype.findManyByFileNames, () => {
    let fileNames: Set<string>;
    let quizzes: Quiz[];

    beforeEach(async () => {
      fileNames = new Set<string>();
      quizzes = await Promise.all(
        QuizFactory.buildList(3).map((quiz) => {
          fileNames.add(quiz.imageFileName as string);
          return repository.insert(quiz);
        }),
      );
    });

    describe('이미지 파일명 리스트를 주면', () => {
      it('이미지 파일명에 맞는 퀴즈 목록을 반환해야 한다.', async () => {
        await expect(
          repository.findManyByFileNames(fileNames),
        ).resolves.toEqual(expect.arrayContaining(quizzes));
      });
    });
  });
});
