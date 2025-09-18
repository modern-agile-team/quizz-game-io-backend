import {
  BaseEntity,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum GameRoomMemberRole {
  host = 'host',
  player = 'player',
}

export interface GameRoomMemberProps {
  accountId: string;
  role: GameRoomMemberRole;
  nickname: string;
}

interface CreateGameRoomMemberProps {
  accountId: string;
  role: GameRoomMemberRole;
  nickname: string;
}

export class GameRoomMember extends BaseEntity<GameRoomMemberProps> {
  constructor(props: CreateEntityProps<GameRoomMemberProps>) {
    super(props);
  }

  static create(props: CreateGameRoomMemberProps) {
    const id = generateEntityId();
    const date = new Date();

    return new GameRoomMember({
      id,
      props: {
        accountId: props.accountId,
        role: props.role,
        nickname: props.nickname,
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get role(): GameRoomMemberRole {
    return this.props.role;
  }

  get nickname(): string {
    return this.props.nickname;
  }

  changeRole(role: GameRoomMemberRole) {
    this.props.role = role;
  }

  public validate(): void {}
}
