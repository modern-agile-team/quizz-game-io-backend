import { ICommand } from '@nestjs/cqrs';

export interface IDeleteNicknameSourceCommandProps {
  nicknameSourceId: string;
}

export class DeleteNicknameSourceCommand implements ICommand {
  readonly nicknameSourceId: string;

  constructor(props: IDeleteNicknameSourceCommandProps) {
    this.nicknameSourceId = props.nicknameSourceId;
  }
}
