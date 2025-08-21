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
  gameRoomId: string;
  role: GameRoomMemberRole;
}

interface CreateGameRoomMemberProps {
  accountId: string;
  gameRoomId: string;
  role: GameRoomMemberRole;
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
        gameRoomId: props.gameRoomId,
        role: props.role,
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get gameRoomId(): string {
    return this.props.gameRoomId;
  }

  get role(): GameRoomMemberRole {
    return this.props.role;
  }

  public validate(): void {}
}
