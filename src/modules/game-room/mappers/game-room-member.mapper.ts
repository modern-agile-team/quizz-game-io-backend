import {
  GameRoomMember,
  GameRoomMemberRole,
} from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberRaw } from '@module/game-room/repositories/game-room/game-room.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class GameRoomMemberMapper extends BaseMapper {
  static toEntity(raw: GameRoomMemberRaw): GameRoomMember {
    return new GameRoomMember({
      id: this.toEntityId(raw.id),
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
      props: {
        accountId: this.toEntityId(raw.accountId),
        role: GameRoomMemberRole[raw.role],
        nickname: raw.nickname,
      },
    });
  }

  static toPersistence(entity: GameRoomMember): GameRoomMemberRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      accountId: this.toPrimaryKey(entity.props.accountId),
      role: entity.props.role as PrismaJson.GameRoomMemberRole,
      nickname: entity.props.nickname,
    };
  }
}
