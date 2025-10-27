import { QuizImage as QuizImageModel } from '@prisma/client';

import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';

import {
  IOffsetPaginated,
  ISort,
  RepositoryPort,
} from '@common/base/base.repository';

export const QUIZ_IMAGE_REPOSITORY = Symbol('QUIZ_IMAGE_REPOSITORY');

export interface QuizImageRaw extends QuizImageModel {}

export interface QuizImageFilter {
  category?: string;
}

export type QuizImageOrder = ISort<
  'createdAt' | 'updatedAt' | 'name' | 'category'
>[];

export interface FindAllQuizImagesOffsetPaginatedParams {
  pageInfo: {
    offset: number;
    limit: number;
  };
  filter?: QuizImageFilter;
  order?: QuizImageOrder;
}

export interface QuizImageRepositoryPort
  extends RepositoryPort<QuizImage, QuizImageFilter, QuizImageOrder> {
  /**
   * @todo set 자료형으로 인풋변경
   */
  findByFileNames(fileNames: string[]): Promise<QuizImage[]>;
  findAllOffsetPaginated(
    params: FindAllQuizImagesOffsetPaginatedParams,
  ): Promise<IOffsetPaginated<QuizImage>>;
}
