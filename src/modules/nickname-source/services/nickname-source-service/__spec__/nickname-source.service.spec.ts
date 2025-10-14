import { Test } from '@nestjs/testing';

import { NicknameSourceFactory } from '@module/nickname-source/entities/__spec__/nickname-source.factory';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { NicknameSourceService } from '@module/nickname-source/services/nickname-source-service/nickname-source.service';
import { NICKNAME_SOURCE_SERVICE } from '@module/nickname-source/services/nickname-source-service/nickname-source.service.interface';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(NicknameSourceService, () => {
  let service: NicknameSourceService;

  let nicknameSourceRepository: NicknameSourceRepositoryPort;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ClsModuleFactory(), NicknameSourceRepositoryModule],
      providers: [
        {
          provide: NICKNAME_SOURCE_SERVICE,
          useClass: NicknameSourceService,
        },
      ],
    }).compile();

    service = module.get<NicknameSourceService>(NICKNAME_SOURCE_SERVICE);

    nicknameSourceRepository = module.get<NicknameSourceRepositoryPort>(
      NICKNAME_SOURCE_REPOSITORY,
    );
  });

  describe(NicknameSourceService.prototype.issueNickname, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let nicknameSource: NicknameSource;

    beforeEach(async () => {
      jest.spyOn(nicknameSourceRepository, 'incrementSequence');
      nicknameSource = await nicknameSourceRepository.insert(
        NicknameSourceFactory.build(),
      );
    });

    describe('닉네임 소스를 이용하여 닉네임을 발급하면', () => {
      it('닉네임 소스를 반환하고 시퀀스를 1 증가시켜야한다.', async () => {
        await expect(service.issueNickname()).resolves.toBeInstanceOf(
          NicknameSource,
        );

        expect(nicknameSourceRepository.incrementSequence).toHaveBeenCalled();
      });
    });
  });
});
