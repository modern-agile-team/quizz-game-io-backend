import { ICommand } from '@nestjs/cqrs';

export interface IDeleteQuizImageCommandProps {
  quizImageId: string;
}

export class DeleteQuizImageCommand implements ICommand {
  readonly quizImageId: string;

  constructor(props: IDeleteQuizImageCommandProps) {
    this.quizImageId = props.quizImageId;
  }
}
