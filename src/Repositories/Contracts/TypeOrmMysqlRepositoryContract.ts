import {
  FindOptionsWhere,
  ObjectID,
  Repository as TypeOrmRepository,
  SelectQueryBuilder
} from 'typeorm'
import { EntityDataMapperContract } from '../../DataMappers/Contracts/EntityDataMapperContract'
import { DataNotFoundException } from '../../Models/Exceptions/DataNotFoundException'
import { IFilterDefault } from '../../Models/Interfaces/IFilterDefault'
import { IItemListModel } from '../../Models/Interfaces/IItemListModel'
import { RepositoryContract } from './RepositoryContract'

export abstract class TypeOrmMysqlRepositoryContract<
  TDomainEntity,
  TDaoEntity
> extends RepositoryContract<TDomainEntity, TDaoEntity> {
  constructor(
    protected readonly repository: TypeOrmRepository<TDaoEntity>,
    protected dataMapper: EntityDataMapperContract<TDomainEntity, TDaoEntity>,
    protected storeId: string | null,
    dataNotFoundException: DataNotFoundException
  ) {
    super(dataNotFoundException)
  }

  public async create(entity: TDomainEntity): Promise<TDomainEntity> {
    const result = await this.repository.insert(
      this.dataMapper.toDaoEntity(entity)
    )

    return this.findOneByPrimaryColumn(
      result.identifiers[0][this.getPrimaryColumnName()]
    )
  }

  public async save(
    entity: TDomainEntity,
    withFindBeforeReturn: boolean = true
  ): Promise<TDomainEntity> {
    await this.repository.save(
      this.repository.create(this.dataMapper.toDaoEntity(entity))
    )

    if (!withFindBeforeReturn) return entity

    return this.findOneByPrimaryColumn(
      this.getPrimaryColumnValueByEntity(entity)
    )
  }

  public async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<TDaoEntity>
  ): Promise<boolean> {
    await this.repository.delete(criteria)

    return true
  }

  public async findAll<TFilter extends IFilterDefault>(
    filter: TFilter,
    bypassStoreId: boolean = false
  ): Promise<IItemListModel<TDomainEntity>> {
    const hasStoreIdColumn = this.hasColumn('storeId')

    const query = this.applyPaginator(
      filter,
      this.customToFindAll(filter, this.repository.createQueryBuilder())
    )

    if (hasStoreIdColumn && !bypassStoreId)
      query.andWhere(`${this.getTableName()}.store_id = :storeId`, {
        storeId: this.storeId
      })

    return {
      items: this.dataMapper.toDomainEntityMany(await query.getMany()),
      total: await query.getCount()
    }
  }

  public async findOneByPrimaryColumn(
    value: string,
    bypassStoreId: boolean = false
  ): Promise<TDomainEntity> {
    const hasStoreIdColumn = this.hasColumn('storeId')

    const query = this.customToFindOneByPrimaryColumn(
      this.repository
        .createQueryBuilder()
        .where(
          `${this.getTableName()}.${this.getPrimaryColumnName()} = :value`,
          { value }
        )
    )

    if (hasStoreIdColumn && !bypassStoreId)
      query.andWhere(`${this.getTableName()}.store_id = :storeId`, {
        storeId: this.storeId
      })

    const result = await query.getOne()

    if (!result) throw this.dataNotFoundException

    return this.dataMapper.toDomainEntity(result)
  }

  public applyPaginator(
    filter: IFilterDefault,
    query: SelectQueryBuilder<TDaoEntity>
  ): SelectQueryBuilder<TDaoEntity> {
    const skip = (this.getPage(filter) - 1) * this.getSize(filter)
    const size = this.getSize(filter)

    return query.skip(skip).take(size)
  }

  protected getPage(filter: IFilterDefault) {
    filter.page =
      typeof filter.page === 'string' ? parseInt(filter.page) : filter.page

    let page = 1
    if (filter.page > 0) {
      page =
        typeof filter.page === 'string' ? parseInt(filter.page) : filter.page
    }

    return page
  }

  protected getSize(filter: IFilterDefault) {
    filter.size =
      typeof filter.size === 'string' ? parseInt(filter.size) : filter.size

    let size = 15
    if (filter.size > 0) {
      size = filter.size
      if (filter.size > 100) {
        size = 100
      }
    }

    return size
  }

  protected customToFindAll(
    filter: IFilterDefault,
    query: SelectQueryBuilder<TDaoEntity>
  ): SelectQueryBuilder<TDaoEntity> {
    return query
  }

  protected customToFindOneByPrimaryColumn(
    query: SelectQueryBuilder<TDaoEntity>
  ): SelectQueryBuilder<TDaoEntity> {
    return query
  }

  protected hasColumn(columnName: string): boolean {
    return this.repository.metadata.columns
      .map(column => column.propertyName)
      .includes(columnName)
  }

  protected hasRelation(propertyName: string): boolean {
    return this.repository.metadata.relations
      .map(relation => relation.propertyName)
      .includes(propertyName)
  }

  protected getTableName(): string {
    return this.repository.metadata.targetName
  }

  protected getPrimaryColumnName(): string {
    return this.repository.metadata.primaryColumns[0].propertyAliasName
  }

  protected getPrimaryColumnValueByEntity(entity: TDomainEntity): string {
    return entity[this.getPrimaryColumnName()]
  }
}
