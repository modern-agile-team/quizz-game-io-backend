import { IQuery } from '@nestjs/cqrs';

import { QuizImageOrder } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';

export interface IListQuizImagesQueryProps {
  category?: string;
  sort?: QuizImageOrder;
  page?: number;
  perPage?: number;
}

export class ListQuizImagesQuery implements IQuery {
  readonly category?: string;
  readonly sort?: QuizImageOrder;
  readonly page?: number;
  readonly perPage?: number;

  constructor(props: IListQuizImagesQueryProps) {
    this.category = props.category;
    this.sort = props.sort;
    this.page = props.page;
    this.perPage = props.perPage;
  }
}
