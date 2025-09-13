import {
  GameRoomMember,
  GameRoomMemberRole,
} from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberCapacityExceededError } from '@module/game-room/errors/game-room-member-capacity-exceeded.error';
import { GameRoomValidationError } from '@module/game-room/errors/game-room-validation.error';
import { GameRoomClosedEvent } from '@module/game-room/events/game-room-closed/game-room-closed.event';
import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';
import { GameRoomMemberJoinedEvent } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.event';
import { GameRoomMemberLeftEvent } from '@module/game-room/events/game-room-member-left/game-room-member-left.event';
import { GameRoomMemberRoleChangedEvent } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.event';

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
  members: GameRoomMember[];
}

interface CreateGameRoomProps {
  hostId: string;
  status: GameRoomStatus;
  visibility: GameRoomVisibility;
  title: string;
  maxMembersCount: number;
  currentMembersCount?: number;
}

interface JoinProps {
  accountId: string;
  nickname: string;
  role: GameRoomMemberRole;
}

/**
 * @todo #68 이슈에서 members 속성 정리
 */
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
        members: [],
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
        currentMembersCount: gameRoom.props.currentMembersCount,
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

  get visibility(): GameRoomVisibility {
    return this.props.visibility;
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

  set members(value: GameRoomMember[]) {
    this.props.members = value;
  }

  close() {
    this.apply(
      new GameRoomClosedEvent(this.id, {
        gameRoomId: this.id,
      }),
    );
  }

  join(props: JoinProps): GameRoomMember {
    if (
      props.role === GameRoomMemberRole.host &&
      props.accountId !== this.props.hostId
    ) {
      throw new GameRoomValidationError(
        'Only the room creator can be the host.',
      );
    }

    if (this.props.currentMembersCount >= this.props.maxMembersCount) {
      throw new GameRoomMemberCapacityExceededError();
    }

    const member = GameRoomMember.create({
      accountId: props.accountId,
      gameRoomId: this.id,
      role: props.role,
      nickname: props.nickname,
    });

    this.apply(
      new GameRoomMemberJoinedEvent(this.id, {
        gameRoomId: this.id,
        accountId: member.accountId,
        role: member.role,
        nickname: member.nickname,
      }),
    );

    return member;
  }

  leave(member: GameRoomMember) {
    this.apply(
      new GameRoomMemberLeftEvent(this.id, {
        gameRoomId: this.id,
        accountId: member.accountId,
        memberId: member.id,
        role: member.role,
        nickname: member.nickname,
      }),
    );
  }

  changeMemberRole(member: GameRoomMember, role: GameRoomMemberRole) {
    if (role === GameRoomMemberRole.host) {
      this.props.hostId = member.accountId;
    }

    member.changeRole(role);

    this.apply(
      new GameRoomMemberRoleChangedEvent(this.id, {
        gameRoomId: this.id,
        accountId: member.accountId,
        memberId: member.id,
        role: role,
        nickname: member.nickname,
      }),
    );
  }

  public validate(): void {}
}
