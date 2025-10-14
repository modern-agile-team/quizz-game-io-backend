import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceRaw } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class NicknameSourceMapper extends BaseMapper {
  static toEntity(raw: NicknameSourceRaw): NicknameSource {
    return new NicknameSource({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        name: raw.name,
        sequence: raw.sequence,
      },
    });
  }

  static toPersistence(entity: NicknameSource): NicknameSourceRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      name: entity.name,
      sequence: entity.sequence,
    };
  }
}
