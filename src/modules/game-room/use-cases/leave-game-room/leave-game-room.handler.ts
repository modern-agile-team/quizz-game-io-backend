import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberNotFoundError } from '@module/game-room/errors/game-room-member-not-found.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { LeaveGameRoomCommand } from '@module/game-room/use-cases/leave-game-room/leave-game-room.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(LeaveGameRoomCommand)
export class LeaveGameRoomHandler
  implements ICommandHandler<LeaveGameRoomCommand, void>
{
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: LeaveGameRoomCommand): Promise<void> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      command.gameRoomId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError();
    }

    const member = gameRoom.members.find(
      (member) => member.accountId === command.currentAccountId,
    );

    if (member === undefined) {
      throw new GameRoomMemberNotFoundError();
    }

    gameRoom.leaveMember(member);

    if (gameRoom.isEmptyRoom()) {
      gameRoom.close();

      await this.gameRoomRepository.delete(gameRoom);
      await this.eventStore.storeAggregateEvents(gameRoom);
    } else {
      if (gameRoom.host === undefined) {
        gameRoom.changeMemberRole(gameRoom.members[0], GameRoomMemberRole.host);
      }

      await this.gameRoomRepository.update(gameRoom);
    }

    await this.eventStore.storeAggregateEvents(gameRoom);
  }
}
