import { Factory } from 'rosie';

import { GetQuizQuery } from '@module/quiz/use-cases/get-quiz/get-quiz.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetQuizQueryFactory = Factory.define<GetQuizQuery>(
  GetQuizQuery.name,
  GetQuizQuery,
).attrs({
  quizId: () => generateEntityId(),
});
