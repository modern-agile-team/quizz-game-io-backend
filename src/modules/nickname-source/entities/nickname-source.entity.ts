import { NicknameSourceCreatedEvent } from '@module/nickname-source/events/nickname-source-created.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export interface NicknameSourceProps {
  name: string;
  sequence: number;
}

interface CreateNicknameSourceProps {
  name: string;
}

export class NicknameSource extends AggregateRoot<NicknameSourceProps> {
  constructor(props: CreateEntityProps<NicknameSourceProps>) {
    super(props);
  }

  static create(props: CreateNicknameSourceProps) {
    const id = generateEntityId();
    const date = new Date();

    const nicknameSource = new NicknameSource({
      id,
      props: {
        name: props.name,
        sequence: 1,
      },
      createdAt: date,
      updatedAt: date,
    });

    nicknameSource.apply(
      new NicknameSourceCreatedEvent(nicknameSource.id, {
        nicknameSourceId: nicknameSource.id,
        name: props.name,
        sequence: nicknameSource.sequence,
      }),
    );

    return nicknameSource;
  }

  get name(): string {
    return this.props.name;
  }

  get sequence(): number {
    return this.props.sequence;
  }

  get fullname(): string {
    return `${this.name}${this.sequence}`;
  }

  public validate(): void {}
}
