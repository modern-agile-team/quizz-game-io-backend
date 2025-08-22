import { parseSort } from '@common/transformer/parse-sort.transformer';

describe(parseSort, () => {
  const ALLOW_FIELDS = new Set(['id', 'createdAt']);

  it('여러 필드로 정렬할 수 있다.', () => {
    expect(parseSort('id:asc,createdAt:desc', ALLOW_FIELDS)).toEqual([
      {
        field: 'id',
        direction: 'asc',
      },
      {
        field: 'createdAt',
        direction: 'desc',
      },
    ]);
  });

  it('허용되지 않은 필드는 무시한다.', () => {
    expect(parseSort('qwe:desc', ALLOW_FIELDS)).toEqual([]);
  });

  it('허용되지 않은 정렬 방향은 무시한다.', () => {
    expect(parseSort('id:qwe', ALLOW_FIELDS)).toEqual([]);
  });
});
