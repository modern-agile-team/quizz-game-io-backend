import { IQuery } from '@nestjs/cqrs';

export interface IGetQuizQueryProps {
  quizId: string;
}

export class GetQuizQuery implements IQuery {
  readonly quizId: string;

  constructor(props: IGetQuizQueryProps) {
    this.quizId = props.quizId;
  }
}
