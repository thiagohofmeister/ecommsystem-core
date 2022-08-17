import { FindOptionsWhere, ObjectID } from 'typeorm'
import { IFilterDefault } from './IFilterDefault'
import { IItemListModel } from './IItemListModel'

export interface IRepository<TDomainEntity> {
  save(
    entity: TDomainEntity,
    withFindBeforeReturn?: boolean
  ): Promise<TDomainEntity>
  create(entity: TDomainEntity): Promise<TDomainEntity>
  findOneByPrimaryColumn(value: string): Promise<TDomainEntity>
  findAll(filter: IFilterDefault): Promise<IItemListModel<TDomainEntity>>
  delete(criteria: any): Promise<boolean>
}
