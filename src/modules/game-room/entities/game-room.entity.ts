import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum GameRoomStatus {
  waiting = 'waiting',
  ready = 'ready',
  inProgress = 'inProgress',
  finished = 'finished',
  paused = 'paused',
}

export enum GameRoomVisibility {
  public = 'public',
  private = 'private',
  hidden = 'hidden',
}

export interface GameRoomProps {
  hostId: string;
  status: GameRoomStatus;
  visibility: GameRoomVisibility;
  title: string;
  maxPlayersCount: number;
}

interface CreateGameRoomProps {
  hostId: string;
  status: GameRoomStatus;
  visibility: GameRoomVisibility;
  title: string;
  maxPlayersCount: number;
}

export class GameRoom extends AggregateRoot<GameRoomProps> {
  constructor(props: CreateEntityProps<GameRoomProps>) {
    super(props);
  }

  static create(props: CreateGameRoomProps) {
    const id = generateEntityId();
    const date = new Date();

    const gameRoom = new GameRoom({
      id,
      props: {
        hostId: props.hostId,
        status: props.status,
        visibility: props.visibility,
        title: props.title,
        maxPlayersCount: props.maxPlayersCount,
      },
      createdAt: date,
      updatedAt: date,
    });

    gameRoom.apply(
      new GameRoomCreatedEvent(gameRoom.id, {
        hostId: props.hostId,
        status: props.status,
        visibility: props.visibility,
        title: props.title,
        maxPlayers: props.maxPlayersCount,
      }),
    );

    return gameRoom;
  }

  get hostId(): string {
    return this.props.hostId;
  }

  get status(): GameRoomStatus {
    return this.props.status;
  }

  get title(): string {
    return this.props.title;
  }

  get maxPlayersCount(): number {
    return this.props.maxPlayersCount;
  }

  public validate(): void {}
}
