import { Factory } from 'rosie';

import { StartGameCommand } from '@module/game-room/use-cases/start-game/start-game.command';

import { generateEntityId } from '@common/base/base.entity';

export const StartGameCommandFactory = Factory.define<StartGameCommand>(
  StartGameCommand.name,
  StartGameCommand,
).attrs({
  gameRoomId: () => generateEntityId(),
});
