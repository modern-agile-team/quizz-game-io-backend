import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import { NicknameSourceNotFoundError } from '@module/nickname-source/errors/nickname-source-not-found.error';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { DeleteNicknameSourceCommand } from '@module/nickname-source/use-cases/delete-nickname-source/delete-nickname-source.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(DeleteNicknameSourceCommand)
export class DeleteNicknameSourceHandler
  implements ICommandHandler<DeleteNicknameSourceCommand, void>
{
  constructor(
    @Inject(NICKNAME_SOURCE_REPOSITORY)
    private readonly nicknameSourceRepository: NicknameSourceRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  @Transactional()
  async execute(command: DeleteNicknameSourceCommand): Promise<void> {
    const nicknameSource = await this.nicknameSourceRepository.findOneById(
      command.nicknameSourceId,
    );

    if (nicknameSource === undefined) {
      throw new NicknameSourceNotFoundError();
    }

    nicknameSource.delete();

    await this.nicknameSourceRepository.delete(nicknameSource);

    await this.eventStore.storeAggregateEvents(nicknameSource);
  }
}
