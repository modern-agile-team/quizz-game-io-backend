import { ICommand } from '@nestjs/cqrs';

import { AccountRole } from '@module/account/entities/account.entity';

export interface ICreateAccountWithGoogleCommandProps {
  role: AccountRole;
  socialProviderUid: string;
}

export class CreateAccountWithGoogleCommand implements ICommand {
  readonly role: AccountRole;
  readonly socialProviderUid: string;

  constructor(props: ICreateAccountWithGoogleCommandProps) {
    this.role = props.role;
    this.socialProviderUid = props.socialProviderUid;
  }
}
