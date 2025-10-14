import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';

export const NICKNAME_SOURCE_SERVICE = Symbol('NICKNAME_SOURCE_SERVICE');

export interface INicknameSourceService {
  issueNickname(): Promise<NicknameSource>;
}
