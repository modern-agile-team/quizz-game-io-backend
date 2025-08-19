import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { RoomMember } from '@module/game-room/entities/room-member.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { RoomMemberAlreadyExistsError } from '@module/game-room/errors/room-member-already-exists.error';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import {
  ROOM_MEMBER_REPOSITORY,
  RoomMemberRepositoryPort,
} from '@module/game-room/repositories/room-member/room-member.repository.port';
import { JoinGameRoomCommand } from '@module/game-room/use-cases/join-game-room/join-game-room.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(JoinGameRoomCommand)
export class JoinGameRoomHandler
  implements ICommandHandler<JoinGameRoomCommand, RoomMember>
{
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(ROOM_MEMBER_REPOSITORY)
    private readonly roomMemberRepository: RoomMemberRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: JoinGameRoomCommand): Promise<RoomMember> {
    const [gameRoom, existingMember] = await Promise.all([
      this.gameRoomRepository.findOneById(command.gameRoomId),
      this.roomMemberRepository.findByAccountIdInGameRoom(
        command.currentAccountId,
        command.gameRoomId,
      ),
    ]);

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError();
    }

    if (existingMember !== undefined) {
      throw new RoomMemberAlreadyExistsError();
    }

    const member = gameRoom.joinMember(command.currentAccountId);

    await this.roomMemberRepository.insert(member);

    await this.eventStore.storeAggregateEvents(gameRoom);

    return member;
  }
}
