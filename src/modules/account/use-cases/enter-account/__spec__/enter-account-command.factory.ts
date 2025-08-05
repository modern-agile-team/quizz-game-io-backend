import { Factory } from 'rosie';

import { EnterAccountCommand } from '@module/account/use-cases/enter-account/enter-account.command';

import { generateEntityId } from '@common/base/base.entity';

export const EnterAccountCommandFactory = Factory.define<EnterAccountCommand>(
  EnterAccountCommand.name,
  EnterAccountCommand,
).attrs({
  accountId: () => generateEntityId(),
});
