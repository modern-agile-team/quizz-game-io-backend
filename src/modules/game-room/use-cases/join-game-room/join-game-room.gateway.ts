// src/core/socket/gateways/room-sub.gateway.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { IsString } from 'class-validator';
import { AsyncApiSub } from 'nestjs-asyncapi';
import { Socket } from 'socket.io';

import { WS_NAMESPACE } from '@core/socket/socket-event.emitter.interface';
import { gameRoomKeyOf } from '@core/socket/socket-room.util';

class RoomSubscribeDto {
  @ApiProperty()
  @IsString()
  roomId: string;
}

/**
 * @todo 유효한 사용자인지 검증
 */
@WebSocketGateway({ namespace: WS_NAMESPACE.ROOT, cors: true })
export class JoinGameRoomGateway {
  @AsyncApiSub({
    tags: [{ name: 'game_room' }],
    channel: 'game_room.subscribe',
    summary: '특정 게임룸 구독',
    message: { payload: RoomSubscribeDto },
  })
  @SubscribeMessage('game_room.subscribe')
  async subscribe(
    @MessageBody() dto: RoomSubscribeDto,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(gameRoomKeyOf(dto.roomId));
  }
}
