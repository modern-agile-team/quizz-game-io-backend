import { ICommand } from '@nestjs/cqrs';

export interface IDeleteQuizCommandProps {
  quizId: string;
}

export class DeleteQuizCommand implements ICommand {
  readonly quizId: string;

  constructor(props: IDeleteQuizCommandProps) {
    this.quizId = props.quizId;
  }
}
