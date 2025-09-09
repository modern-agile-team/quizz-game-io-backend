import { Factory } from 'rosie';

import { LeaveGameRoomCommand } from '@module/game-room/use-cases/leave-game-room/leave-game-room.command';

import { generateEntityId } from '@common/base/base.entity';

export const LeaveGameRoomCommandFactory = Factory.define<LeaveGameRoomCommand>(
  LeaveGameRoomCommand.name,
  LeaveGameRoomCommand,
).attrs({
  currentAccountId: () => generateEntityId(),
  gameRoomId: () => generateEntityId(),
});
