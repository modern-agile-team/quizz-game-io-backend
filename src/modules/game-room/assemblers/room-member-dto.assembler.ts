import { RoomMemberDto } from '@module/game-room/dto/room-member.dto';
import { RoomMember } from '@module/game-room/entities/room-member.entity';

export class RoomMemberDtoAssembler {
  static convertToDto(roomMember: RoomMember): RoomMemberDto {
    const dto = new RoomMemberDto({
      id: roomMember.id,
      createdAt: roomMember.createdAt,
      updatedAt: roomMember.updatedAt,
    });

    return dto;
  }
}
