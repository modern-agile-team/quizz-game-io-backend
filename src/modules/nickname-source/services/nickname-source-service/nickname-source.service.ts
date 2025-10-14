import { Inject, Injectable } from '@nestjs/common';

import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { INicknameSourceService } from '@module/nickname-source/services/nickname-source-service/nickname-source.service.interface';

@Injectable()
export class NicknameSourceService implements INicknameSourceService {
  constructor(
    @Inject(NICKNAME_SOURCE_REPOSITORY)
    private readonly nicknameSourceRepository: NicknameSourceRepositoryPort,
  ) {}

  async issueNickname(): Promise<NicknameSource> {
    const nicknameSources =
      await this.nicknameSourceRepository.findAllOffsetPaginated({
        pageInfo: {
          offset: 0,
          limit: 1,
        },
        order: [
          { field: 'sequence', direction: 'asc' },
          { field: 'createdAt', direction: 'asc' },
        ],
      });

    const nicknameSource = nicknameSources.data[0];

    nicknameSource.issue();

    await this.nicknameSourceRepository.incrementSequence(nicknameSource.id);

    return nicknameSource;
  }
}
