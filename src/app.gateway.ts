import { Inject, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';

import { AsyncApiPub } from 'nestjs-asyncapi';
import { Socket } from 'socket.io';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { LobbyAccountEnteredSocketEvent } from '@module/account/events/account-entered-event/lobby-account-entered-socket.event';
import { EnterAccountCommand } from '@module/account/use-cases/enter-account/enter-account.command';

import {
  InternalServerError,
  UnauthorizedError,
} from '@common/base/base.error';

import {
  ACCOUNT_SOCKET_INDEX_STORE,
  IAccountSocketIndexStore,
} from '@core/socket/index-store/account-socket-index.store.interface';
import { WS_NAMESPACE } from '@core/socket/socket-event.emitter.interface';

@WebSocketGateway({ namespace: WS_NAMESPACE.ROOT, cors: true })
export class AppGateway implements OnGatewayConnection {
  private readonly logger = new Logger(AppGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
    @Inject(ACCOUNT_SOCKET_INDEX_STORE)
    private readonly accountSocketIndexStore: IAccountSocketIndexStore,
  ) {}

  @AsyncApiPub({
    description: '유저가 접속했을 때 발생하는 이벤트',
    channel: LobbyAccountEnteredSocketEvent.EVENT_NAME,
    message: {
      payload: LobbyAccountEnteredSocketEvent,
    },
  })
  async handleConnection(client: Socket) {
    try {
      const token = this.extractTokenFromClient(client);

      if (token === undefined) {
        throw new UnauthorizedError();
      }

      const payload = this.jwtService.verify(token);

      client.data.user = { id: payload.sub, roles: payload.roles };

      const command = new EnterAccountCommand({
        accountId: payload.sub,
      });

      await this.commandBus.execute(command);

      await this.accountSocketIndexStore.set(payload.sub, client.id);
    } catch (err) {
      if (
        err instanceof UnauthorizedError ||
        err instanceof JsonWebTokenError
      ) {
        client.emit('exception', {
          closeCode: 3000,
          code: UnauthorizedError.CODE,
          message: 'Unauthorized can not access',
        });
      }

      if (err instanceof AccountNotFoundError) {
        client.emit('exception', {
          closeCode: 3000,
          code: AccountNotFoundError.CODE,
          message: 'Account not found',
        });
      }

      client.emit('exception', {
        closeCode: 3000,
        code: InternalServerError.CODE,
        message: 'Internal server error',
      });

      this.logger.log('handleConnection error', err);

      client.disconnect(true);
    }
  }

  private extractTokenFromClient(client: Socket): string | undefined {
    const authHeader: string | undefined = client.handshake.auth.token;

    if (authHeader === undefined) {
      return;
    }

    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
