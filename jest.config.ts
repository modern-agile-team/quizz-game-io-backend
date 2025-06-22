/* eslint-disable */
export default {
  /**
   * 병렬실행에 의한 커넥션 부족을 해결하기 위해 max worker 개수를 조정
   */
  maxWorkers: 2,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/$1',
    '^@module/(.*)$': '<rootDir>/modules/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@core/(.*)$': '<rootDir>/core/$1',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  displayName: 'quizzes-game-io-backend',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/../tsconfig.spec.json' },
    ],
  },
  setupFilesAfterEnv: [
    '<rootDir>/../test/after-env-setup.ts',
    'jest-extended/all',
  ],
  globalSetup: '<rootDir>/../test/global-setup.ts',
  globalTeardown: '<rootDir>/../test/global-teardown.ts',
};
