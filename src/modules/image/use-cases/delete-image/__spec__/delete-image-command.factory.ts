import { Factory } from 'rosie';

import { DeleteImageCommand } from '@module/image/use-cases/delete-image/delete-image.command';

import { generateEntityId } from '@common/base/base.entity';

export const DeleteImageCommandFactory = Factory.define<DeleteImageCommand>(
  DeleteImageCommand.name,
  DeleteImageCommand,
).attrs({
  imageId: () => generateEntityId(),
});
