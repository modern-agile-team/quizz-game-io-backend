import { IQuery } from '@nestjs/cqrs';

export interface IListQuizImagesQueryProps {
  category?: string;
  page?: number;
  perPage?: number;
}

export class ListQuizImagesQuery implements IQuery {
  readonly category?: string;
  readonly page?: number;
  readonly perPage?: number;

  constructor(props: IListQuizImagesQueryProps) {
    this.category = props.category;
    this.page = props.page;
    this.perPage = props.perPage;
  }
}
