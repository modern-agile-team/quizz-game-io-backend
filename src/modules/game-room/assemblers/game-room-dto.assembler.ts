import { GameRoomMemberDtoAssembler } from '@module/game-room/assemblers/game-room-member-dto.assembler';
import { GameRoomSocketEventDto } from '@module/game-room/dto/game-room-socket-event.dto';
import { GameRoomDto } from '@module/game-room/dto/game-room.dto';
import { GameRoom } from '@module/game-room/entities/game-room.entity';

export class GameRoomDtoAssembler {
  static convertToDto(gameRoom: GameRoom): GameRoomDto {
    const dto = new GameRoomDto({
      id: gameRoom.id,
      createdAt: gameRoom.createdAt,
      updatedAt: gameRoom.updatedAt,
    });

    dto.hostId = gameRoom.props.hostId;
    dto.status = gameRoom.props.status;
    dto.title = gameRoom.props.title;
    dto.maxMembersCount = gameRoom.props.maxMembersCount;
    dto.currentMembersCount = gameRoom.props.currentMembersCount;

    return dto;
  }

  static convertToSocketEventDto(gameRoom: GameRoom): GameRoomSocketEventDto {
    const dto = new GameRoomSocketEventDto();

    dto.gameRoomId = gameRoom.id;
    dto.status = gameRoom.status;
    dto.visibility = gameRoom.visibility;
    dto.title = gameRoom.title;
    dto.maxPlayers = gameRoom.maxMembersCount;
    dto.currentMembersCount = gameRoom.currentMembersCount;
    dto.members = gameRoom.members.map((member) =>
      GameRoomMemberDtoAssembler.convertToSocketEventDto(member),
    );

    return dto;
  }
}
