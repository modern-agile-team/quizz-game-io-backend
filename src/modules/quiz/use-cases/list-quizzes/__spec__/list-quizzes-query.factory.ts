import { Factory } from 'rosie';

import { ListQuizzesQuery } from '@module/quiz/use-cases/list-quizzes/list-quizzes.query';

export const ListQuizzesQueryFactory = Factory.define<ListQuizzesQuery>(
  ListQuizzesQuery.name,
  ListQuizzesQuery,
).attrs({});
