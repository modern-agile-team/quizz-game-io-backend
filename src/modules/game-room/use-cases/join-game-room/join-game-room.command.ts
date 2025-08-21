import { ICommand } from '@nestjs/cqrs';

import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';

export interface IJoinGameRoomCommandProps {
  currentAccountId: string;
  gameRoomId: string;
  role: GameRoomMemberRole;
}

export class JoinGameRoomCommand implements ICommand {
  readonly currentAccountId: string;
  readonly gameRoomId: string;
  readonly role: GameRoomMemberRole;

  constructor(props: IJoinGameRoomCommandProps) {
    this.currentAccountId = props.currentAccountId;
    this.gameRoomId = props.gameRoomId;
    this.role = props.role;
  }
}
