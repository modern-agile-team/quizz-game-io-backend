import {
  BaseEntity,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum RoomMemberRole {
  host = 'host',
  player = 'player',
}

export interface RoomMemberProps {
  accountId: string;
  gameRoomId: string;
  role: RoomMemberRole;
}

interface CreateRoomMemberProps {
  accountId: string;
  gameRoomId: string;
  role: RoomMemberRole;
}

export class RoomMember extends BaseEntity<RoomMemberProps> {
  constructor(props: CreateEntityProps<RoomMemberProps>) {
    super(props);
  }

  static create(props: CreateRoomMemberProps) {
    const id = generateEntityId();
    const date = new Date();

    return new RoomMember({
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

  public validate(): void {}
}
