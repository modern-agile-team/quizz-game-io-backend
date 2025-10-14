import { IQuery } from '@nestjs/cqrs';

export interface IGetNicknameSourceQueryProps {
  nicknameSourceId: string;
}

export class GetNicknameSourceQuery implements IQuery {
  readonly nicknameSourceId: string;

  constructor(props: IGetNicknameSourceQueryProps) {
    this.nicknameSourceId = props.nicknameSourceId;
  }
}
