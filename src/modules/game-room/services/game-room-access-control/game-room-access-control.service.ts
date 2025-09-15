import { Inject, Injectable } from '@nestjs/common';

import { GameRoomAccessDeniedError } from '@module/game-room/errors/game-room-access-denied.error';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import {
  AllowMemberProps,
  IGameRoomAccessControlService,
} from '@module/game-room/services/game-room-access-control/game-room-access-control.service.interface';

@Injectable()
export class GameRoomAccessControlService
  implements IGameRoomAccessControlService
{
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
  ) {}

  async allowMember(props: AllowMemberProps): Promise<void> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      props.gameRoomId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomAccessDeniedError('Game room not found');
    }

    const gameRoomMember = gameRoom.members.find(
      (member) => member.accountId === props.accountId,
    );

    if (gameRoomMember === undefined) {
      throw new GameRoomAccessDeniedError(
        'Only members of the game room can access it',
      );
    }
  }
}
