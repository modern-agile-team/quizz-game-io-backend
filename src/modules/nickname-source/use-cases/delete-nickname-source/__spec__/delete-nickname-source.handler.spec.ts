import { Test, TestingModule } from '@nestjs/testing';

import { NicknameSourceFactory } from '@module/nickname-source/entities/__spec__/nickname-source.factory';
import { NicknameSourceNotFoundError } from '@module/nickname-source/errors/nickname-source-not-found.error';
import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { DeleteNicknameSourceCommandFactory } from '@module/nickname-source/use-cases/delete-nickname-source/__spec__/delete-nickname-source-command.factory';
import { DeleteNicknameSourceCommand } from '@module/nickname-source/use-cases/delete-nickname-source/delete-nickname-source.command';
import { DeleteNicknameSourceHandler } from '@module/nickname-source/use-cases/delete-nickname-source/delete-nickname-source.handler';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(DeleteNicknameSourceHandler.name, () => {
  let handler: DeleteNicknameSourceHandler;

  let nicknameSourceRepository: NicknameSourceRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: DeleteNicknameSourceCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        NicknameSourceRepositoryModule,
        EventStoreModule,
      ],
      providers: [DeleteNicknameSourceHandler],
    }).compile();

    handler = module.get<DeleteNicknameSourceHandler>(
      DeleteNicknameSourceHandler,
    );

    nicknameSourceRepository = module.get<NicknameSourceRepositoryPort>(
      NICKNAME_SOURCE_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = DeleteNicknameSourceCommandFactory.build();
  });

  describe('닉네임 소스를 삭제하면', () => {
    beforeEach(async () => {
      await nicknameSourceRepository.insert(
        NicknameSourceFactory.build({ id: command.nicknameSourceId }),
      );
    });

    it('닉네임 소스가 삭제되어야한다.', async () => {
      await expect(handler.execute(command)).resolves.toBeUndefined();

      await expect(
        nicknameSourceRepository.findOneById(command.nicknameSourceId),
      ).resolves.toBeUndefined();
    });
  });

  describe('닉네임 소스가 존재하지 않는 경우', () => {
    it('닉네임 소스가 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(
        NicknameSourceNotFoundError,
      );
    });
  });
});
