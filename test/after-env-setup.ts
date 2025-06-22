/* eslint-disable */
import { mikroOrmFactory } from '../test/mikro-orm.factory';
import { faker } from '@faker-js/faker';

jest.mock('nestjs-request-context', () => ({
  RequestContext: {
    currentContext: {
      req: {
        user: {
          id: faker.string.numeric(),
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
