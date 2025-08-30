import { Inject, Injectable } from '@nestjs/common';

import { GameRoomAccessDeniedError } from '@module/game-room/errors/game-room-access-denied.error';
import {
  GAME_ROOM_MEMBER_REPOSITORY,
  GameRoomMemberRepositoryPort,
} from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';
import {
  AllowMemberProps,
  IGameRoomAccessControlService,
} from '@module/game-room/services/game-room-access-control/game-room-access-control.service.interface';

@Injectable()
export class GameRoomAccessControlService
  implements IGameRoomAccessControlService
{
  constructor(
    @Inject(GAME_ROOM_MEMBER_REPOSITORY)
    private readonly gameRoomMemberRepository: GameRoomMemberRepositoryPort,
  ) {}

  async allowMember(props: AllowMemberProps): Promise<void> {
    const gameRoomMember =
      await this.gameRoomMemberRepository.findByAccountIdInGameRoom(
        props.accountId,
        props.gameRoomId,
      );

    if (gameRoomMember === undefined) {
      throw new GameRoomAccessDeniedError(
        'Only members of the game room can access it',
      );
    }
  }
}
