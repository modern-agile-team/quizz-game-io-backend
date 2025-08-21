import { Factory } from 'rosie';

import { JoinGameRoomCommand } from '@module/game-room/use-cases/join-game-room/join-game-room.command';

import { generateEntityId } from '@common/base/base.entity';

export const JoinGameRoomCommandFactory = Factory.define<JoinGameRoomCommand>(
  JoinGameRoomCommand.name,
  JoinGameRoomCommand,
).attrs({
  currentAccountId: () => generateEntityId(),
  gameRoomId: () => generateEntityId(),
});
