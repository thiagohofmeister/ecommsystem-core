import { FindOptionsWhere, ObjectID } from 'typeorm'
import { DataNotFoundException } from '../../Models/Exceptions/DataNotFoundException'
import { IFilterDefault } from '../../Models/Interfaces/IFilterDefault'
import { IItemListModel } from '../../Models/Interfaces/IItemListModel'
import { IRepository } from '../../Models/Interfaces/IRepository'

export abstract class RepositoryContract<TDomainEntity, TDaoEntity>
  implements IRepository<TDomainEntity>
{
  constructor(protected dataNotFoundException: DataNotFoundException) {}

  abstract delete(
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
  ): Promise<boolean>

  abstract save(
    entity: TDomainEntity,
    withFindBeforeReturn: boolean
  ): Promise<TDomainEntity>

  abstract create(entity: TDomainEntity): Promise<TDomainEntity>

  abstract findOneByPrimaryColumn(id: string): Promise<TDomainEntity>

  abstract findAll(
    filter: IFilterDefault
  ): Promise<IItemListModel<TDomainEntity>>
}
