import { ICommand } from '@nestjs/cqrs';

export interface ICreateQuizzesCommandProps {
  type: string;
  answer: string;
  question?: string;
  imageUrl?: string;
}

export class CreateQuizzesCommand implements ICommand {
  constructor(readonly props: ICreateQuizzesCommandProps[]) {}
}
