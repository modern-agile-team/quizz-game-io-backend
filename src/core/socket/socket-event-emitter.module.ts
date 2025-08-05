import { Module } from '@nestjs/common';

import { SocketEventEmitter } from '@core/socket/socket-event.emitter';
import { SOCKET_EVENT_EMITTER } from '@core/socket/socket-event.emitter.interface';

@Module({
  providers: [
    {
      provide: SOCKET_EVENT_EMITTER,
      useClass: SocketEventEmitter,
    },
  ],
  exports: [SOCKET_EVENT_EMITTER],
})
export class SocketEventEmitterModule {}
