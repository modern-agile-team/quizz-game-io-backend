const APP = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  APP_STAGE: 'APP_STAGE',
} as const;

const DATABASE = {
  DATABASE_URL: 'DATABASE_URL',
} as const;

const REDIS = {
  REDIS_URL: 'REDIS_URL',
};

const JWT = {
  JWT_SECRET_KEY: 'JWT_SECRET_KEY',
  JWT_ISSUER: 'JWT_ISSUER',
  JWT_ACCESS_TOKEN_EXPIRES_IN: 'JWT_ACCESS_TOKEN_EXPIRES_IN',
} as const;

export const ENV_KEY = {
  ...APP,
  ...DATABASE,
  ...REDIS,
  ...JWT,
} as const;
