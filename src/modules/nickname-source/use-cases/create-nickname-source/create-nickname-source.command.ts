import { ICommand } from '@nestjs/cqrs';

export interface ICreateNicknameSourceCommandProps {
  name: string;
}

export class CreateNicknameSourceCommand implements ICommand {
  readonly name: string;

  constructor(props: ICreateNicknameSourceCommandProps) {
    this.name = props.name;
  }
}
