import {
  GameRoomMember,
  GameRoomMemberRole,
} from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberAlreadyExistsError } from '@module/game-room/errors/game-room-member-already-exists.error';
import { GameRoomMemberCapacityExceededError } from '@module/game-room/errors/game-room-member-capacity-exceeded.error';
import { GameRoomValidationError } from '@module/game-room/errors/game-room-validation.error';
import { GameRoomClosedEvent } from '@module/game-room/events/game-room-closed/game-room-closed.event';
import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';
import { GameRoomMemberJoinedEvent } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.event';
import { GameRoomMemberLeftEvent } from '@module/game-room/events/game-room-member-left/game-room-member-left.event';
import { GameRoomMemberRoleChangedEvent } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.event';
import { GameRoomStartingEvent } from '@module/game-room/events/game-room-starting/game-room-starting.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum GameRoomStatus {
  waiting = 'waiting',
  starting = 'starting',
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
  hostAccountId: string;
  status: GameRoomStatus;
  visibility: GameRoomVisibility;
  title: string;
  maxMembersCount: number;
  members: GameRoomMember[];
}

interface CreateGameRoomProps {
  status: GameRoomStatus;
  visibility: GameRoomVisibility;
  title: string;
  maxMembersCount: number;
  hostAccountId: string;
  hostNickname: string;
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
        hostAccountId: props.hostAccountId,
        status: props.status,
        visibility: props.visibility,
        title: props.title,
        maxMembersCount: props.maxMembersCount,
        members: [],
      },
      createdAt: date,
      updatedAt: date,
    });

    gameRoom.apply(
      new GameRoomCreatedEvent(gameRoom.id, {
        hostAccountId: props.hostAccountId,
        status: props.status,
        visibility: props.visibility,
        title: props.title,
        maxPlayers: props.maxMembersCount,
        currentMembersCount: gameRoom.currentMembersCount,
      }),
    );

    gameRoom.joinMember(
      GameRoomMember.create({
        accountId: props.hostAccountId,
        nickname: props.hostNickname,
        role: GameRoomMemberRole.host,
      }),
    );

    return gameRoom;
  }

  get hostAccountId(): string {
    return this.props.hostAccountId;
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
    return this.props.members.length;
  }

  get host(): GameRoomMember | undefined {
    return this.props.members.find(
      (member) => member.role === GameRoomMemberRole.host,
    );
  }

  get members(): GameRoomMember[] {
    return this.props.members;
  }
  set members(value: GameRoomMember[]) {
    this.props.members = value;
  }

  start() {
    if (this.props.status !== GameRoomStatus.waiting) {
      throw new GameRoomValidationError(
        'Game can only be started from the waiting state.',
      );
    }

    this.props.status = GameRoomStatus.starting;

    this.apply(
      new GameRoomStartingEvent(this.id, {
        gameRoomId: this.id,
        status: this.props.status,
      }),
    );
  }

  close() {
    this.apply(
      new GameRoomClosedEvent(this.id, {
        gameRoomId: this.id,
      }),
    );
  }

  joinMember(member: GameRoomMember): GameRoomMember {
    const existingMember = this.props.members.find(
      (joinedMember) => joinedMember.accountId === member.accountId,
    );

    if (existingMember !== undefined) {
      throw new GameRoomMemberAlreadyExistsError();
    }

    if (member.role === GameRoomMemberRole.host && this.host !== undefined) {
      throw new GameRoomValidationError(`Game room host only one`);
    }

    if (this.currentMembersCount >= this.props.maxMembersCount) {
      throw new GameRoomMemberCapacityExceededError();
    }

    this.props.members.push(member);

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

  leaveMember(member: GameRoomMember) {
    const memberIdx = this.props.members.findIndex((el) => el.id === member.id);

    this.props.members.splice(memberIdx, 1);

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
    if (member.role === role) {
      return member;
    }

    if (role === GameRoomMemberRole.host && this.host !== undefined) {
      throw new GameRoomValidationError(`Game room host only one`);
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

    return member;
  }

  isEmptyRoom(): boolean {
    if (this.props.members.length === 0) {
      return true;
    }
    return false;
  }

  public validate(): void {}
}
