import { ICommand } from '@nestjs/cqrs';

export interface ICreateQuizzesCommandProps {
  type: string;
  answer: string;
  question: string | null;
  imageUrl: string | null;
}

export class CreateQuizzesCommand implements ICommand {
  constructor(readonly props: ICreateQuizzesCommandProps[]) {}
}
