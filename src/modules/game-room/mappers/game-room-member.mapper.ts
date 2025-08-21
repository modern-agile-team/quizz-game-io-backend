import {
  GameRoomMember,
  GameRoomMemberRole,
} from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberRaw } from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class GameRoomMemberMapper extends BaseMapper {
  static toEntity(raw: GameRoomMemberRaw): GameRoomMember {
    return new GameRoomMember({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        accountId: this.toEntityId(raw.accountId),
        gameRoomId: this.toEntityId(raw.gameRoomId),
        role: GameRoomMemberRole[raw.role],
      },
    });
  }

  static toPersistence(entity: GameRoomMember): GameRoomMemberRaw {
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
