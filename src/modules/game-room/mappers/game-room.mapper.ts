import {
  GameRoom,
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';
import { GameRoomRaw } from '@module/game-room/repositories/game-room/game-room.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class GameRoomMapper extends BaseMapper {
  static toEntity(raw: GameRoomRaw): GameRoom {
    return new GameRoom({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        hostId: this.toEntityId(raw.accountId),
        status: GameRoomStatus[raw.status],
        visibility: GameRoomVisibility[raw.visibility],
        title: raw.title,
        maxMembersCount: raw.maxMembersCount,
        currentMembersCount: raw.currentMembersCount,
        members: [],
      },
    });
  }

  static toPersistence(entity: GameRoom): GameRoomRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      accountId: this.toPrimaryKey(entity.props.hostId),
      status: entity.props.status,
      visibility: entity.props.visibility,
      title: entity.props.title,
      maxMembersCount: entity.props.maxMembersCount,
      currentMembersCount: entity.props.currentMembersCount,
    };
  }
}
