import { ICommand } from '@nestjs/cqrs';

export interface IUpdateQuizImageCommandProps {
  quizImageId: string;
  name?: string;
  category?: string;
}

export class UpdateQuizImageCommand implements ICommand {
  readonly quizImageId: string;
  readonly name?: string;
  readonly category?: string;

  constructor(props: IUpdateQuizImageCommandProps) {
    this.quizImageId = props.quizImageId;
    this.name = props.name;
    this.category = props.category;
  }
}
