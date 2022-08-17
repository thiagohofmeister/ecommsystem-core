import { RedisClientType } from 'redis'
import { EntityDataMapperContract } from '../../DataMappers/Contracts/EntityDataMapperContract'
import { DataNotFoundException } from '../../Models/Exceptions/DataNotFoundException'
import { IFilterDefault } from '../../Models/Interfaces/IFilterDefault'
import { IItemListModel } from '../../Models/Interfaces/IItemListModel'
import { IRepository } from '../../Models/Interfaces/IRepository'
import { RedisCollection } from '../../Models/RedisCollection'

export abstract class RedisClientRepositoryContract<
  TDomainValue,
  TDaoValue = TDomainValue
> implements IRepository<RedisCollection<TDomainValue>>
{
  constructor(
    protected readonly repository: RedisClientType,
    protected readonly dataMapper: EntityDataMapperContract<
      TDomainValue,
      TDaoValue
    >,
    protected storeId: string | null,
    protected dataNotFoundException?: DataNotFoundException
  ) {
    if (!dataNotFoundException)
      this.dataNotFoundException = new DataNotFoundException()
  }

  findAll(
    filter: IFilterDefault
  ): Promise<IItemListModel<RedisCollection<TDomainValue>>> {
    throw new Error('Method not implemented.')
  }

  async findOneByPrimaryColumn(
    id: string
  ): Promise<RedisCollection<TDomainValue>> {
    const value = await this.repository.get(this.getFullKey(id))

    if (!value) throw this.dataNotFoundException

    const ttl = await this.repository.ttl(this.getFullKey(id))

    return new RedisCollection(
      id,
      this.dataMapper.toDomainEntity(JSON.parse(value)),
      ttl
    )
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.repository.del(this.getFullKey(key))

      return true
    } catch (error) {
      return false
    }
  }

  async create(
    entity: RedisCollection<TDomainValue>
  ): Promise<RedisCollection<TDomainValue>> {
    await this.repository.set(
      this.getFullKey(entity.getKey()),
      JSON.stringify(entity.getValue()),
      { EX: this.getSecondsToExpire(entity.getExpiration()) }
    )

    return entity
  }

  async save(
    entity: RedisCollection<TDomainValue>
  ): Promise<RedisCollection<TDomainValue>> {
    return this.create(entity)
  }

  async createOrUpdate(entity: RedisCollection<TDomainValue>): Promise<void> {
    await this.create(entity)
  }

  async update(
    entity: RedisCollection<TDomainValue>
  ): Promise<boolean | RedisCollection<TDomainValue>> {
    return await this.create(entity)
  }

  protected getSecondsToExpire(expiration?: Date | number): number {
    if (!!expiration) {
      if (typeof expiration === 'number') {
        return Math.min(expiration, this.getDefaultExpirationInSeconds())
      }

      const localDate = new Date(
        new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      )
      const secondsToExpire =
        (expiration.getTime() - localDate.getTime()) / 1000

      return Math.min(secondsToExpire, this.getDefaultExpirationInSeconds())
    }

    return this.getDefaultExpirationInSeconds()
  }

  protected getDefaultExpirationInSeconds(): number {
    return 60 * 60 * 6 // 6 hours
  }

  protected getFullKey(key: string): string {
    return [this.getKeyPrefix(), key, this.storeId].filter(i => !!i).join(':')
  }

  protected abstract getKeyPrefix(): string
}
