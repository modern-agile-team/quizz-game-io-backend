import { ICommand } from '@nestjs/cqrs';

export interface IUpdateQuizCommandProps {
  quizId: string;
  type?: string;
  answer?: string;
  question?: string | null;
  imageFileName?: string | null;
}

export class UpdateQuizCommand implements ICommand {
  readonly quizId: string;
  readonly type?: string;
  readonly answer?: string;
  readonly question?: string | null;
  readonly imageFileName?: string | null;

  constructor(props: IUpdateQuizCommandProps) {
    this.quizId = props.quizId;
    this.type = props.type;
    this.answer = props.answer;
    this.question = props.question;
    this.imageFileName = props.imageFileName;
  }
}
