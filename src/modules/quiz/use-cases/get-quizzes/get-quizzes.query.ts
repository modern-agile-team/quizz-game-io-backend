import { IQuery } from '@nestjs/cqrs';

export interface IGetQuizzesQueryProps {
  quizId: string;
}

export class GetQuizzesQuery implements IQuery {
  readonly quizId: string;

  constructor(props: IGetQuizzesQueryProps) {
    this.quizId = props.quizId;
  }
}
