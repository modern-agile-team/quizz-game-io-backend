export const GAME_ROOM_ACCESS_CONTROL_SERVICE = Symbol(
  'GAME_ROOM_ACCESS_CONTROL_SERVICE',
);

export interface AllowMemberProps {
  accountId: string;
  gameRoomId: string;
}

export interface AllowHostProps {
  accountId: string;
  gameRoomId: string;
}

export interface IGameRoomAccessControlService {
  allowMember(props: AllowMemberProps): Promise<void>;
  allowHost(props: AllowHostProps): Promise<void>;
}
