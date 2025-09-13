import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';
import {
  GameRoomCreatedSocketEventAction,
  LobbyGameRoomCreatedSocketEvent,
} from '@module/game-room/socket-events/game-room-created.socket-event';
import { GetGameRoomQuery } from '@module/game-room/use-cases/get-game-room/get-game-room.query';

import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';

@AsyncApi()
export class GameRoomCreatedHandler {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
  ) {}

  @OnEvent(GameRoomCreatedEvent.name)
  async handle(event: GameRoomCreatedEvent): Promise<void> {
    const gameRoom = await this.queryBus.execute<GetGameRoomQuery, GameRoom>(
      new GetGameRoomQuery({ gameRoomId: event.aggregateId }),
    );

    this.publish(gameRoom);
  }

  @AsyncApiPub({
    tags: [{ name: 'lobby' }],
    description: '게임방이 생성됨',
    channel: LobbyGameRoomCreatedSocketEvent.EVENT_NAME,
    message: { payload: LobbyGameRoomCreatedSocketEvent },
  })
  private publish(gameRoom: GameRoom): void {
    const socketEvent = new LobbyGameRoomCreatedSocketEvent(
      GameRoomCreatedSocketEventAction.created,
      GameRoomDtoAssembler.convertToSocketEventDto(gameRoom),
    );

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, socketEvent);
  }
}
