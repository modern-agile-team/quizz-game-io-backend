import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoomCollectionDto } from '@module/game-room/dto/game-room-collection.dto';
import { GameRoom } from '@module/game-room/entities/game-room.entity';

export class GameRoomCollectionDtoAssembler {
  static convertToDto(domainObject: GameRoom[]): GameRoomCollectionDto {
    const dto = new GameRoomCollectionDto();

    dto.data = domainObject.map(GameRoomDtoAssembler.convertToDto);

    return dto;
  }
}
