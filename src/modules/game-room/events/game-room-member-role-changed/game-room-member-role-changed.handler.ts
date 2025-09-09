import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomMemberRoleChangedSocketEvent } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed-socket.event';
import { GameRoomMemberRoleChangedEvent } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.event';

import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';
import { gameRoomKeyOf } from '@core/socket/socket-room.util';

@AsyncApi()
export class GameRoomMemberRoleChangedHandler {
  constructor(
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
  ) {}

  @OnEvent(GameRoomMemberRoleChangedEvent.name)
  async handle(event: GameRoomMemberRoleChangedEvent): Promise<void> {
    this.publish(event);
  }

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '유저의 게임방 역할이 변경',
    channel: GameRoomMemberRoleChangedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomMemberRoleChangedSocketEvent },
  })
  private publish(event: GameRoomMemberRoleChangedEvent): void {
    const socketEvent = new GameRoomMemberRoleChangedSocketEvent({
      accountId: event.eventPayload.accountId,
      gameRoomId: event.eventPayload.gameRoomId,
      role: event.eventPayload.role,
      nickname: event.eventPayload.nickname,
    });

    this.socketEmitter.emitToRoom(
      WS_NAMESPACE.ROOT,
      gameRoomKeyOf(event.eventPayload.gameRoomId),
      socketEvent,
    );
  }
}
