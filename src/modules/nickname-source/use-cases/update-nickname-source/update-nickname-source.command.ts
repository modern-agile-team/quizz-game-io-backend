import { ICommand } from '@nestjs/cqrs';

export interface IUpdateNicknameSourceCommandProps {
  nicknameSourceId: string;
  name?: string;
}

export class UpdateNicknameSourceCommand implements ICommand {
  readonly nicknameSourceId: string;
  readonly name?: string;

  constructor(props: IUpdateNicknameSourceCommandProps) {
    this.nicknameSourceId = props.nicknameSourceId;
    this.name = props.name;
  }
}
