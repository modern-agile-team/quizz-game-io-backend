import { Module } from '@nestjs/common';

import { SocketEventPublisher } from '@core/socket/event-publisher/socket-event.publisher';
import { SOCKET_EVENT_PUBLISHER } from '@core/socket/event-publisher/socket-event.publisher.interface';
import { SocketSessionManagerModule } from '@core/socket/session-manager/socket-session.manager.module';
import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [SocketEventEmitterModule, SocketSessionManagerModule],
  providers: [
    {
      provide: SOCKET_EVENT_PUBLISHER,
      useClass: SocketEventPublisher,
    },
  ],
  exports: [SOCKET_EVENT_PUBLISHER],
})
export class SocketEventPublisherModule {}
