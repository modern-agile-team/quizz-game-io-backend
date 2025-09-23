import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
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
      status: command.status,
      visibility: command.visibility,
      title: command.title,
      quizzesCount: command.quizzesCount,
      maxMembersCount: command.maxPlayersCount,
      hostAccountId: command.currentAccountId,
      hostNickname: existingAccount.nickname,
      quizTimeLimitInSeconds: GameRoom.DEFAULT_QUIZ_TIME_LIMIT_IN_SECONDS,
    });

    await this.gameRoomRepository.insert(gameRoom);

    await this.eventStore.storeAggregateEvents(gameRoom);

    return gameRoom;
  }
}
