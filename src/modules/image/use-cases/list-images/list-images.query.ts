import { IQuery } from '@nestjs/cqrs';

export interface IListImagesQueryProps {
  category?: string;
  page?: number;
  perPage?: number;
}

export class ListImagesQuery implements IQuery {
  readonly category?: string;
  readonly page?: number;
  readonly perPage?: number;

  constructor(props: IListImagesQueryProps) {
    this.category = props.category;
    this.page = props.page;
    this.perPage = props.perPage;
  }
}
