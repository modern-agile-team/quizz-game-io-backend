import { Factory } from 'rosie';

import { GetQuizzesQuery } from '@module/quiz/use-cases/get-quizzes/get-quizzes.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetQuizzesQueryFactory = Factory.define<GetQuizzesQuery>(
  GetQuizzesQuery.name,
  GetQuizzesQuery,
).attrs({
  quizId: () => generateEntityId(),
});
