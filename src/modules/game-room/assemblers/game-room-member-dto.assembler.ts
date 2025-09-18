import { GameRoomMemberSocketEventDto } from '@module/game-room/dto/game-room-member-socket-event.dto';
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
    dto.role = gameRoomMember.role;
    dto.nickname = gameRoomMember.nickname;

    return dto;
  }

  static convertToSocketEventDto(
    gameRoomMember: GameRoomMember,
  ): GameRoomMemberSocketEventDto {
    const dto = new GameRoomMemberSocketEventDto();

    dto.id = gameRoomMember.id;
    dto.accountId = gameRoomMember.accountId;
    dto.role = gameRoomMember.role;
    dto.nickname = gameRoomMember.nickname;

    return dto;
  }
}
