import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberNotFoundError } from '@module/game-room/errors/game-room-member-not-found.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import {
  GAME_ROOM_MEMBER_REPOSITORY,
  GameRoomMemberRepositoryPort,
} from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';
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
    @Inject(GAME_ROOM_MEMBER_REPOSITORY)
    private readonly gameRoomMemberRepository: GameRoomMemberRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: LeaveGameRoomCommand): Promise<void> {
    const [gameRoom, members] = await Promise.all([
      this.gameRoomRepository.findOneById(command.gameRoomId),
      this.gameRoomMemberRepository.findByGameRoomId(command.gameRoomId),
    ]);

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError();
    }

    const targetMemberIdx = members.findIndex(
      (member) => member.accountId === command.currentAccountId,
    );
    const member = members[targetMemberIdx];

    if (member === undefined) {
      throw new GameRoomMemberNotFoundError();
    }

    gameRoom.leave(member);
    members.splice(targetMemberIdx, 1);

    if (members.length === 0) {
      gameRoom.close();

      await this.gameRoomRepository.delete(gameRoom);
    } else {
      const hostMember = members.find(
        (member) => member.accountId === gameRoom.hostId,
      );

      if (hostMember === undefined) {
        const newHost = members[0];
        gameRoom.changeMemberRole(newHost, GameRoomMemberRole.host);

        await this.gameRoomRepository.update(gameRoom);
        await this.gameRoomMemberRepository.update(newHost);
      }

      await this.gameRoomMemberRepository.delete(member);
    }

    await this.eventStore.storeAggregateEvents(gameRoom);
  }
}
