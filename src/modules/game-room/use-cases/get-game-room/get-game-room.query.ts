import { IQuery } from '@nestjs/cqrs';

export interface IGetGameRoomQueryProps {
  gameRoomId: string;
}

export class GetGameRoomQuery implements IQuery {
  readonly gameRoomId: string;

  constructor(props: IGetGameRoomQueryProps) {
    this.gameRoomId = props.gameRoomId;
  }
}
