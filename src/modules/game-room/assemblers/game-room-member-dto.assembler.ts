import { GameRoomMemberDto } from '@module/game-room/dto/game-room-member.dto';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';

export class GameRoomMemberDtoAssembler {
  static convertToDto(gameRoomMember: GameRoomMember): GameRoomMemberDto {
    const dto = new GameRoomMemberDto({
      id: gameRoomMember.id,
      createdAt: gameRoomMember.createdAt,
      updatedAt: gameRoomMember.updatedAt,
    });

    dto.accountId = gameRoomMember.accountId;
    dto.gameRoomId = gameRoomMember.gameRoomId;
    dto.role = gameRoomMember.role;

    return dto;
  }
}
