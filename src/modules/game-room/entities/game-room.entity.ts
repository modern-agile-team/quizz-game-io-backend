import {
  RoomMember,
  RoomMemberRole,
} from '@module/game-room/entities/room-member.entity';
import { GameRoomMemberCapacityExceededError } from '@module/game-room/errors/game-room-member-capacity-exceeded.error';
import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';
import { GameRoomMemberJoinedEvent } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.event';

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
  maxMembersCount: number;
  currentMembersCount: number;
}

interface CreateGameRoomProps {
  hostId: string;
  status: GameRoomStatus;
  visibility: GameRoomVisibility;
  title: string;
  maxMembersCount: number;
  currentMembersCount?: number;
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
        maxMembersCount: props.maxMembersCount,
        currentMembersCount: props.currentMembersCount ?? 0,
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
        maxPlayers: props.maxMembersCount,
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

  get maxMembersCount(): number {
    return this.props.maxMembersCount;
  }

  get currentMembersCount(): number {
    return this.props.currentMembersCount;
  }

  joinMember(accountId: string): RoomMember {
    if (this.props.currentMembersCount >= this.props.maxMembersCount) {
      throw new GameRoomMemberCapacityExceededError();
    }

    const member = RoomMember.create({
      accountId: accountId,
      gameRoomId: this.id,
      role: RoomMemberRole.player,
    });

    this.apply(
      new GameRoomMemberJoinedEvent(this.id, {
        gameRoomId: this.id,
        accountId: member.accountId,
        role: member.role,
      }),
    );

    return member;
  }

  public validate(): void {}
}
