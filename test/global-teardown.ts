module.exports = async function () {
  if (global.__REDIS_CONTAINER__) {
    await global.__REDIS_CONTAINER__.stop();
  }
  if (global.__POSTGRES_CONTAINER__) {
    await global.__POSTGRES_CONTAINER__.stop();
  }
};
