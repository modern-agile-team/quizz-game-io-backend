import { applyDecorators } from '@nestjs/common';

import { Transform, TransformFnParams } from 'class-transformer';

import { SortDto } from '@common/base/base.dto';

export const parseSort = (
  value: unknown,
  allowFields: ReadonlySet<string>,
): SortDto[] | undefined => {
  if (value === undefined) {
    return;
  }
  if (typeof value !== 'string') {
    return;
  }

  const parsedOrders = value.split(',');

  const orders = parsedOrders
    .map((parsedOrder) => {
      const [field, direction] = parsedOrder.split(':');

      return {
        field,
        direction,
      };
    })
    .filter(({ field, direction }) => {
      if (allowFields.has(field) === false) {
        return false;
      }
      if (direction !== 'desc' && direction !== 'asc') {
        return false;
      }
      return true;
    })
    .map(({ field, direction }) => {
      const sortDto = new SortDto();

      sortDto.field = field;
      sortDto.direction = direction as SortDto['direction'];

      return sortDto;
    });

  return orders;
};

export const ParseSort = (allowFields: ReadonlySet<string>) => {
  return applyDecorators(
    Transform(({ value }: TransformFnParams): SortDto[] | undefined => {
      return parseSort(value, allowFields);
    }),
  );
};
