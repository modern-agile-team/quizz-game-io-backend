import { Quiz as QuizModel } from '@prisma/client';

import { Quiz } from '@module/quiz/entities/quiz.entity';

import { ISort, RepositoryPort } from '@common/base/base.repository';

export const QUIZ_REPOSITORY = Symbol('QUIZ_REPOSITORY');

export interface QuizRaw extends QuizModel {}

export interface QuizFilter {}

export interface QuizOrder extends ISort<'createdAt'> {}

export interface QuizRepositoryPort
  extends RepositoryPort<Quiz, QuizFilter, QuizOrder> {
  insertMany(quizzes: Quiz[]): Promise<void>;
  findAll(): Promise<Quiz[]>;
}
