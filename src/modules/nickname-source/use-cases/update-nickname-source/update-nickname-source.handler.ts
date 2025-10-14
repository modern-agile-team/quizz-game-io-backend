import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceAlreadyExistsError } from '@module/nickname-source/errors/nickname-source-already-exists.error';
import { NicknameSourceNotFoundError } from '@module/nickname-source/errors/nickname-source-not-found.error';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { UpdateNicknameSourceCommand } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(UpdateNicknameSourceCommand)
export class UpdateNicknameSourceHandler
  implements ICommandHandler<UpdateNicknameSourceCommand, NicknameSource>
{
  constructor(
    @Inject(NICKNAME_SOURCE_REPOSITORY)
    private readonly nicknameSourceRepository: NicknameSourceRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: UpdateNicknameSourceCommand): Promise<NicknameSource> {
    const nicknameSource = await this.nicknameSourceRepository.findOneById(
      command.nicknameSourceId,
    );

    if (nicknameSource === undefined) {
      throw new NicknameSourceNotFoundError();
    }

    if (command.name === undefined || nicknameSource.name === command.name) {
      return nicknameSource;
    }

    if (command.name !== undefined) {
      const existingNicknameSourceByName =
        await this.nicknameSourceRepository.findOneByName(command.name);

      if (existingNicknameSourceByName !== undefined) {
        throw new NicknameSourceAlreadyExistsError();
      }
    }

    nicknameSource.update({
      name: command.name,
    });

    await this.eventStore.storeAggregateEvents(nicknameSource);

    return nicknameSource;
  }
}
