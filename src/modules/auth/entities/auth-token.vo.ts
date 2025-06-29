import { EntityId } from '@common/base/base.entity';

export interface AuthTokenProps {
  accountId: EntityId;
  accessToken: string;
}

export class AuthToken {
  constructor(readonly props: AuthTokenProps) {}

  get accountId() {
    return this.props.accountId;
  }

  get accessToken() {
    return this.props.accessToken;
  }
}
