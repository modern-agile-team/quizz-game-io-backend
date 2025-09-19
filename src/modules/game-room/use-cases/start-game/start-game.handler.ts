import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { StartGameCommand } from '@module/game-room/use-cases/start-game/start-game.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(StartGameCommand)
export class StartGameHandler
  implements ICommandHandler<StartGameCommand, GameRoom>
{
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: StartGameCommand): Promise<GameRoom> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      command.gameRoomId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError();
    }

    gameRoom.start();

    await this.gameRoomRepository.update(gameRoom);

    await this.eventStore.storeAggregateEvents(gameRoom);

    return gameRoom;
  }
}
