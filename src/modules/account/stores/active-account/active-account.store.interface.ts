export const ACTIVE_ACCOUNT_STORE = Symbol('ACTIVE_ACCOUNT_STORE');

export interface IActiveAccountStore {
  get(): Promise<number>;

  increment(): Promise<number>;

  decrement(): Promise<number>;
}
