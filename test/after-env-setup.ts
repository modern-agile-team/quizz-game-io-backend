/* eslint-disable */
import { mikroOrmFactory } from '../test/mikro-orm.factory';

jest.mock('nestjs-request-context', () => ({
  RequestContext: {
    currentContext: {
      req: {
        user: {
          id: 'test-user-id',
        },
      },
    },
  },
}));

beforeAll(async () => {
  global.orm = await mikroOrmFactory();
});

afterAll(async () => {
  await global.orm.close(true);
});
