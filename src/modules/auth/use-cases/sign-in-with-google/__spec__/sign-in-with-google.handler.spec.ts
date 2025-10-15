import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { SocialProvider } from '@module/account/entities/account.entity';
import { AuthTokenModule } from '@module/auth/services/auth-token/auth-token.module';
import {
  AUTH_TOKEN_SERVICE,
  IAuthTokenService,
} from '@module/auth/services/auth-token/auth-token.service.interface';
import { SignInWithGoogleCommandFactory } from '@module/auth/use-cases/sign-in-with-google/__spec__/sign-in-with-google-command.factory';
import { SignInWithGoogleCommand } from '@module/auth/use-cases/sign-in-with-google/sign-in-with-google.command';
import { SignInWithGoogleHandler } from '@module/auth/use-cases/sign-in-with-google/sign-in-with-google.handler';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(SignInWithGoogleHandler.name, () => {
  let handler: SignInWithGoogleHandler;

  let queryBus: QueryBus;
  let commandBus: CommandBus;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: IAuthTokenService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: SignInWithGoogleCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        CqrsModule,
        AuthTokenModule,
        EventStoreModule,
      ],
      providers: [SignInWithGoogleHandler],
    }).compile();

    handler = module.get<SignInWithGoogleHandler>(SignInWithGoogleHandler);

    queryBus = module.get<QueryBus>(QueryBus);
    commandBus = module.get<CommandBus>(CommandBus);
    authService = module.get<IAuthTokenService>(AUTH_TOKEN_SERVICE);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = SignInWithGoogleCommandFactory.build();
  });

  describe('구글 계정이 존재하는 경우', () => {
    beforeEach(() => {
      jest.spyOn(queryBus, 'execute').mockResolvedValue(
        AccountFactory.build({
          socialProvider: SocialProvider.google,
          socialProviderUid: command.uid,
        }),
      );
      jest.spyOn(commandBus, 'execute');
    });

    it('로그인을 해야한다', async () => {
      await expect(handler.execute(command)).resolves.toBeDefined();
      expect(commandBus.execute).not.toHaveBeenCalled();
    });
  });

  describe('구글 계정이 존재하지 않는 경우', () => {
    beforeEach(() => {
      jest.spyOn(queryBus, 'execute').mockResolvedValue(undefined);
      jest.spyOn(commandBus, 'execute').mockResolvedValue(
        AccountFactory.build({
          socialProvider: SocialProvider.google,
          socialProviderUid: command.uid,
        }),
      );
    });

    it('계정을 생성하고 로그인 해야한다.', async () => {
      await expect(handler.execute(command)).resolves.toBeDefined();
      expect(commandBus.execute).toHaveBeenCalled();
    });
  });
});
