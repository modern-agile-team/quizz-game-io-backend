import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomMemberRoleChangedEvent } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.event';
import {
  GameRoomChangedSocketEvent,
  GameRoomChangedSocketEventAction,
} from '@module/game-room/socket-events/game-room-changed.socket-event';
import { GetGameRoomQuery } from '@module/game-room/use-cases/get-game-room/get-game-room.query';

import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';
import { gameRoomKeyOf } from '@core/socket/socket-room.util';

@AsyncApi()
export class GameRoomMemberRoleChangedHandler {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
  ) {}

  @OnEvent(GameRoomMemberRoleChangedEvent.name)
  async handle(event: GameRoomMemberRoleChangedEvent): Promise<void> {
    const gameRoom = await this.queryBus.execute<GetGameRoomQuery, GameRoom>(
      new GetGameRoomQuery({ gameRoomId: event.eventPayload.gameRoomId }),
    );

    this.publish(gameRoom);
  }

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '유저의 게임방 역할이 변경',
    channel: GameRoomChangedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomChangedSocketEvent },
  })
  private publish(gameRoom: GameRoom): void {
    const socketEvent = new GameRoomChangedSocketEvent(
      GameRoomChangedSocketEventAction.member_role_changed,
      GameRoomDtoAssembler.convertToSocketEventDto(gameRoom),
    );

    this.socketEmitter.emitToRoom(
      WS_NAMESPACE.ROOT,
      gameRoomKeyOf(gameRoom.id),
      socketEvent,
    );
  }
}
