import { Factory } from 'rosie';

import { GetQuizImageQuery } from '@module/quiz-image/use-cases/get-quiz-image/get-quiz-image.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetQuizImageQueryFactory = Factory.define<GetQuizImageQuery>(
  GetQuizImageQuery.name,
  GetQuizImageQuery,
).attrs({
  quizImageId: () => generateEntityId(),
});
