import { ICommand } from '@nestjs/cqrs';

export interface IJoinGameRoomCommandProps {
  currentAccountId: string;
  gameRoomId: string;
}

export class JoinGameRoomCommand implements ICommand {
  readonly currentAccountId: string;
  readonly gameRoomId: string;

  constructor(props: IJoinGameRoomCommandProps) {
    this.currentAccountId = props.currentAccountId;
    this.gameRoomId = props.gameRoomId;
  }
}
