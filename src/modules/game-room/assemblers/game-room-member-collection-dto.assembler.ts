import { GameRoomMemberDtoAssembler } from '@module/game-room/assemblers/game-room-member-dto.assembler';
import { GameRoomMemberCollectionDto } from '@module/game-room/dto/game-room-member-collection.dto';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';

export class GameRoomMemberCollectionDtoAssembler {
  static convertToDto(
    domainObject: GameRoomMember[],
  ): GameRoomMemberCollectionDto {
    const dto = new GameRoomMemberCollectionDto();

    dto.data = domainObject.map(GameRoomMemberDtoAssembler.convertToDto);

    return dto;
  }
}
