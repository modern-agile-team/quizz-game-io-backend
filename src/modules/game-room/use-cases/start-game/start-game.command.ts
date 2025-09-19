import { ICommand } from '@nestjs/cqrs';

export interface IStartGameCommandProps {
  gameRoomId: string;
}

export class StartGameCommand implements ICommand {
  readonly gameRoomId: string;

  constructor(props: IStartGameCommandProps) {
    this.gameRoomId = props.gameRoomId;
  }
}
