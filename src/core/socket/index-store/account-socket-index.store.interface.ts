export const ACCOUNT_SOCKET_INDEX_STORE = Symbol('ACCOUNT_SOCKET_INDEX_STORE');

export interface IAccountSocketIndexStore {
  get(accountId: string): Promise<string | undefined>;

  set(accountId: string, socketId: string): Promise<void>;

  del(accountId: string): Promise<void>;
}
