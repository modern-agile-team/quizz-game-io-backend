import { IQuery } from '@nestjs/cqrs';

export interface IGetQuizImageQueryProps {
  quizImageId: string;
}

export class GetQuizImageQuery implements IQuery {
  readonly quizImageId: string;

  constructor(props: IGetQuizImageQueryProps) {
    this.quizImageId = props.quizImageId;
  }
}
