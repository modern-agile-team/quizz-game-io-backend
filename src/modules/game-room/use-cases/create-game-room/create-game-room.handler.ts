import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import {
  GAME_ROOM_MEMBER_REPOSITORY,
  GameRoomMemberRepositoryPort,
} from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { CreateGameRoomCommand } from '@module/game-room/use-cases/create-game-room/create-game-room.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

/**
 * @todo 방 생성 시 이미 다른 방에 입장 중인 경우 예외 처리
 */
@CommandHandler(CreateGameRoomCommand)
export class CreateGameRoomHandler
  implements ICommandHandler<CreateGameRoomCommand, GameRoom>
{
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(GAME_ROOM_MEMBER_REPOSITORY)
    private readonly gameRoomMemberRepository: GameRoomMemberRepositoryPort,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: CreateGameRoomCommand): Promise<GameRoom> {
    const existingAccount = await this.accountRepository.findOneById(
      command.currentAccountId,
    );

    if (existingAccount === undefined) {
      throw new AccountNotFoundError();
    }

    const gameRoom = GameRoom.create({
      hostId: command.currentAccountId,
      status: command.status,
      visibility: command.visibility,
      title: command.title,
      maxMembersCount: command.maxPlayersCount,
    });

    await this.gameRoomRepository.insert(gameRoom);

    const host = gameRoom.join({
      accountId: command.currentAccountId,
      role: GameRoomMemberRole.host,
      nickname: existingAccount.nickname,
    });

    await this.gameRoomMemberRepository.insert(host);

    await this.eventStore.storeAggregateEvents(gameRoom);

    return gameRoom;
  }
}
