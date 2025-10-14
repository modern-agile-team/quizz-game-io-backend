import { Test, TestingModule } from '@nestjs/testing';

import { NicknameSourceFactory } from '@module/nickname-source/entities/__spec__/nickname-source.factory';
import { NicknameSourceAlreadyExistsError } from '@module/nickname-source/errors/nickname-source-already-exists.error';
import { NicknameSourceNotFoundError } from '@module/nickname-source/errors/nickname-source-not-found.error';
import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { UpdateNicknameSourceCommandFactory } from '@module/nickname-source/use-cases/update-nickname-source/__spec__/update-nickname-source-command.factory';
import { UpdateNicknameSourceCommand } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.command';
import { UpdateNicknameSourceHandler } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.handler';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(UpdateNicknameSourceHandler.name, () => {
  let handler: UpdateNicknameSourceHandler;

  let nicknameSourceRepository: NicknameSourceRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: UpdateNicknameSourceCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        NicknameSourceRepositoryModule,
        EventStoreModule,
      ],
      providers: [UpdateNicknameSourceHandler],
    }).compile();

    handler = module.get<UpdateNicknameSourceHandler>(
      UpdateNicknameSourceHandler,
    );

    nicknameSourceRepository = module.get<NicknameSourceRepositoryPort>(
      NICKNAME_SOURCE_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = UpdateNicknameSourceCommandFactory.build();
  });

  describe('닉네임 소스를 수정하면', () => {
    beforeEach(async () => {
      await nicknameSourceRepository.insert(
        NicknameSourceFactory.build({ id: command.nicknameSourceId }),
      );
    });

    it('닉네임 소스를 수정해야 한다.', async () => {
      await expect(handler.execute(command)).resolves.toEqual(
        expect.objectContaining({
          id: command.nicknameSourceId,
          name: command.name,
        }),
      );
    });
  });

  describe('닉네임 소스가 존재하지 않는 경우', () => {
    it('닉네임 소스가 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(
        NicknameSourceNotFoundError,
      );
    });
  });

  describe('수정하려는 닉네임 소스가 이미 존재하는 경우', () => {
    beforeEach(async () => {
      await nicknameSourceRepository.insert(
        NicknameSourceFactory.build({ id: command.nicknameSourceId }),
      );
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
