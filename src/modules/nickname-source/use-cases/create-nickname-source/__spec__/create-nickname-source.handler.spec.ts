import { Test, TestingModule } from '@nestjs/testing';

import { NicknameSourceFactory } from '@module/nickname-source/entities/__spec__/nickname-source.factory';
import { NicknameSourceAlreadyExistsError } from '@module/nickname-source/errors/nickname-source-already-exists.error';
import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { CreateNicknameSourceCommandFactory } from '@module/nickname-source/use-cases/create-nickname-source/__spec__/create-nickname-source-command.factory';
import { CreateNicknameSourceCommand } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.command';
import { CreateNicknameSourceHandler } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.handler';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateNicknameSourceHandler.name, () => {
  let handler: CreateNicknameSourceHandler;

  let nicknameSourceRepository: NicknameSourceRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: CreateNicknameSourceCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        NicknameSourceRepositoryModule,
        EventStoreModule,
      ],
      providers: [CreateNicknameSourceHandler],
    }).compile();

    handler = module.get<CreateNicknameSourceHandler>(
      CreateNicknameSourceHandler,
    );

    nicknameSourceRepository = module.get<NicknameSourceRepositoryPort>(
      NICKNAME_SOURCE_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CreateNicknameSourceCommandFactory.build();
  });

  describe('닉네임 소스를 생성하면', () => {
    it('닉네임 소스가 생성돼야한다.', async () => {
      await expect(handler.execute(command)).resolves.toEqual(
        expect.objectContaining({
          name: command.name,
        }),
      );
    });
  });

  describe('동일한 닉네임 소스가 존재하는 경우', () => {
    beforeEach(async () => {
      await nicknameSourceRepository.insert(
        NicknameSourceFactory.build({ name: command.name }),
      );
    });

    it('닉네임 소스가 이미 존재한다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(
        NicknameSourceAlreadyExistsError,
      );
    });
  });
});
