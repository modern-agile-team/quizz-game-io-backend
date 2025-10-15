import { IQuery } from '@nestjs/cqrs';

import { SocialProvider } from '@module/account/entities/account.entity';

interface IGetAccountBySocialIdQueryProps {
  provider: SocialProvider;
  providerUid: string;
}

export class GetAccountBySocialIdQuery implements IQuery {
  readonly provider: SocialProvider;
  readonly providerUid: string;

  constructor(props: IGetAccountBySocialIdQueryProps) {
    this.provider = props.provider;
    this.providerUid = props.providerUid;
  }
}
