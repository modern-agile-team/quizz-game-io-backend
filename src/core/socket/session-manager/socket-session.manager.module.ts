import { Module } from '@nestjs/common';

import { AccountSocketIndexStoreModule } from '@core/socket/index-store/account-socket-index.store.module';
import { SocketSessionManager } from '@core/socket/session-manager/socket-session.manager';
import { SOCKET_SESSION_MANAGER } from '@core/socket/session-manager/socket-session.manager.interface';

@Module({
  imports: [AccountSocketIndexStoreModule],
  providers: [
    {
      provide: SOCKET_SESSION_MANAGER,
      useClass: SocketSessionManager,
    },
  ],
  exports: [SOCKET_SESSION_MANAGER],
})
export class SocketSessionManagerModule {}
