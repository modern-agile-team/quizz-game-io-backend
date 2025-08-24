import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberAlreadyExistsError } from '@module/game-room/errors/game-room-member-already-exists.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import {
  GAME_ROOM_MEMBER_REPOSITORY,
  GameRoomMemberRepositoryPort,
} from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { JoinGameRoomCommand } from '@module/game-room/use-cases/join-game-room/join-game-room.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(JoinGameRoomCommand)
export class JoinGameRoomHandler
  implements ICommandHandler<JoinGameRoomCommand, GameRoomMember>
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

  async execute(command: JoinGameRoomCommand): Promise<GameRoomMember> {
    const [existingAccount, gameRoom, existingMember] = await Promise.all([
      this.accountRepository.findOneById(command.currentAccountId),
      this.gameRoomRepository.findOneById(command.gameRoomId),
      this.gameRoomMemberRepository.findByAccountIdInGameRoom(
        command.currentAccountId,
        command.gameRoomId,
      ),
    ]);

    if (existingAccount === undefined) {
      throw new AccountNotFoundError();
    }

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError();
    }

    if (existingMember !== undefined) {
      throw new GameRoomMemberAlreadyExistsError();
    }

    const member = gameRoom.join({
      accountId: command.currentAccountId,
      role: command.role,
      nickname: existingAccount.nickname,
    });

    await this.gameRoomMemberRepository.insert(member);

    await this.eventStore.storeAggregateEvents(gameRoom);

    return member;
  }
}
