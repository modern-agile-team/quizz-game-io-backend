import { ICommand } from '@nestjs/cqrs';

export interface ILeaveGameRoomCommandProps {
  currentAccountId: string;
  gameRoomId: string;
}

export class LeaveGameRoomCommand implements ICommand {
  readonly currentAccountId: string;
  readonly gameRoomId: string;

  constructor(props: ILeaveGameRoomCommandProps) {
    this.currentAccountId = props.currentAccountId;
    this.gameRoomId = props.gameRoomId;
  }
}
