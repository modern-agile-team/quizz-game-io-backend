import { GameRoomDto } from '@module/game-room/dto/game-room.dto';
import { GameRoom } from '@module/game-room/entities/game-room.entity';

export class GameRoomDtoAssembler {
  static convertToDto(gameRoom: GameRoom): GameRoomDto {
    const dto = new GameRoomDto({
      id: gameRoom.id,
      createdAt: gameRoom.createdAt,
      updatedAt: gameRoom.updatedAt,
    });

    return dto;
  }
}
