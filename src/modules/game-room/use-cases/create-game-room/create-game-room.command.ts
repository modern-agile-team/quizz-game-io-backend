import { ICommand } from '@nestjs/cqrs';

import {
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';

export interface ICreateGameRoomCommandProps {
  currentAccountId: string;
  title: string;
  quizzesCount: number;
}

export class CreateGameRoomCommand implements ICommand {
  readonly currentAccountId: string;
  readonly title: string;
  readonly quizzesCount: number;
  readonly status: GameRoomStatus;
  readonly visibility: GameRoomVisibility;
  readonly maxPlayersCount: number;

  constructor(props: ICreateGameRoomCommandProps) {
    this.currentAccountId = props.currentAccountId;
    this.title = props.title;
    this.quizzesCount = props.quizzesCount;
    this.status = GameRoomStatus.waiting;
    this.visibility = GameRoomVisibility.public;
    this.maxPlayersCount = 8;
  }
}
