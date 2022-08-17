export abstract class EntityDataMapperContract<TDomainEntity, TDaoEntity> {
  toDomainEntity(entity: TDaoEntity): TDomainEntity {
    throw new Error('Method not implemented.')
  }

  toDaoEntity(domain: TDomainEntity): TDaoEntity {
    throw new Error('Method not implemented.')
  }

  toDaoEntityMany(domains: TDomainEntity[]): TDaoEntity[] {
    return domains.map(domain => this.toDaoEntity(domain))
  }

  toDomainEntityMany(entities: TDaoEntity[]): TDomainEntity[] {
    return entities.map(entity => this.toDomainEntity(entity))
  }
}
