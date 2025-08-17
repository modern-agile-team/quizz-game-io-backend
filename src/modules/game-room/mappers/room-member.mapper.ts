import {
  RoomMember,
  RoomMemberRole,
} from '@module/game-room/entities/room-member.entity';
import { RoomMemberRaw } from '@module/game-room/repositories/room-member/room-member.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class RoomMemberMapper extends BaseMapper {
  static toEntity(raw: RoomMemberRaw): RoomMember {
    return new RoomMember({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        accountId: this.toEntityId(raw.accountId),
        gameRoomId: this.toEntityId(raw.gameRoomId),
        role: RoomMemberRole[raw.role],
      },
    });
  }

  static toPersistence(entity: RoomMember): RoomMemberRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      accountId: this.toPrimaryKey(entity.props.accountId),
      gameRoomId: this.toPrimaryKey(entity.props.gameRoomId),
      role: entity.props.role,
    };
  }
}
