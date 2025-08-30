import { IQuery } from '@nestjs/cqrs';

export interface IListGameRoomMembersQueryProps {
  gameRoomId: string;
}

export class ListGameRoomMembersQuery implements IQuery {
  readonly gameRoomId: string;

  constructor(props: IListGameRoomMembersQueryProps) {
    this.gameRoomId = props.gameRoomId;
  }
}
