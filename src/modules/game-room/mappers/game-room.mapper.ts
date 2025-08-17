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
        status: GameRoomStatus[raw.status],
        visibility: GameRoomVisibility[raw.visibility],
        title: raw.title,
        maxPlayersCount: raw.maxPlayersCount,
      },
    });
  }

  static toPersistence(entity: GameRoom): GameRoomRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      status: entity.props.status,
      visibility: entity.props.visibility,
      title: entity.props.title,
      maxPlayersCount: entity.props.maxPlayersCount,
    };
  }
}
