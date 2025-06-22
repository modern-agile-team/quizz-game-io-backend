import { EntityManager, EntityName } from '@mikro-orm/postgresql';

import { EntityId, TBaseEntity } from '@common/base/base.entity';
import { IBaseMapper } from '@common/base/base.mapper';

export interface ICursorPaginated<T> {
  cursor?: string;
  data: T[];
}

export interface ICursorPaginatedParams<
  Filter = Record<string, unknown>,
  Order = Record<string, unknown>,
> {
  limit?: number;
  cursor?: string;
  orderBy?: Order;
  filter?: Filter;
}

export interface RepositoryPort<
  E,
  ListFilter = Record<string, unknown>,
  ListOrder = Record<string, unknown>,
> {
  insert(entity: E): Promise<E>;

  findOneById(id: EntityId): Promise<E | undefined>;

  findAllCursorPaginated(
    params: ICursorPaginatedParams<ListOrder, ListFilter>,
  ): Promise<ICursorPaginated<E>>;

  update(entity: E): Promise<E>;

  delete(entity: E): Promise<void>;
}

export abstract class BaseRepository<
  Entity extends TBaseEntity<unknown>,
  Raw extends { id: bigint },
> implements Omit<RepositoryPort<Entity>, 'findAllCursorPaginated'>
{
  protected abstract TABLE_NAME: string;

  constructor(
    protected readonly em: EntityManager,
    protected readonly entityName: EntityName<any>,
    protected readonly mapper: IBaseMapper<Entity, Raw>,
  ) {}

  async insert(entity: Entity): Promise<Entity> {
    const raw = this.mapper.toPersistence(entity);

    await this.em.create(this.entityName, raw);

    return entity;
  }

  async findOneById(id: EntityId): Promise<Entity | undefined> {
    if (isNaN(Number(id))) {
      return;
    }

    const raw = await this.em.findOne(this.entityName, {
      id: this.mapper.toPrimaryKey(id),
    });

    if (raw === null) {
      return;
    }

    return this.mapper.toEntity(raw);
  }

  async update(entity: Entity): Promise<Entity> {
    const raw = this.mapper.toPersistence(entity);

    await this.em.nativeUpdate(
      this.entityName,
      {
        id: raw.id,
      },
      raw,
    );

    return this.mapper.toEntity(raw);
  }

  async delete(entity: Entity): Promise<void> {
    await this.em.nativeDelete(this.entityName, {
      id: entity.id,
    });
  }
}
