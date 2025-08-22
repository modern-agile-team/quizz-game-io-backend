import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const ApiSort = (
  options: ApiPropertyOptions & { allowFields: ReadonlySet<string> },
) => {
  return applyDecorators(
    ApiProperty({
      description: `
    정렬 쿼리. 다중 정렬은 콤마(,)로 구분.
    허용되지 않은 정렬 필드 및 방향은 무시합니다.
    형식: field:asc | field:desc
    허용 필드: ${Array.from(options.allowFields).join(',')},
    예: sort=-title:asc,createdAt:asc
      `,
      default: 'createdAt:asc',
      example: 'createdAt:asc',
      required: false as any,
      type: String,
      ...options,
    }),
  );
};
