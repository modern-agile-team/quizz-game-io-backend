import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceAlreadyExistsError } from '@module/nickname-source/errors/nickname-source-already-exists.error';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { CreateNicknameSourceCommand } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateNicknameSourceCommand)
export class CreateNicknameSourceHandler
  implements ICommandHandler<CreateNicknameSourceCommand, NicknameSource>
{
  constructor(
    @Inject(NICKNAME_SOURCE_REPOSITORY)
    private readonly nicknameSourceRepository: NicknameSourceRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  @Transactional()
  async execute(command: CreateNicknameSourceCommand): Promise<NicknameSource> {
    const existingNicknameSource =
      await this.nicknameSourceRepository.findOneByName(command.name);

    if (existingNicknameSource !== undefined) {
      throw new NicknameSourceAlreadyExistsError();
    }

    const nicknameSource = NicknameSource.create({
      name: command.name,
    });

    await this.nicknameSourceRepository.insert(nicknameSource);

    await this.eventStore.storeAggregateEvents(nicknameSource);

    return nicknameSource;
  }
}
