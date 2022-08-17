import { DataSource, EntityManager } from 'typeorm'

export class TransactionalService {
  constructor(private readonly dataSource: DataSource) {}

  public async execute<T>(
    fn: (manager: EntityManager) => Promise<T>
  ): Promise<T> {
    return await this.dataSource.transaction(async manager => {
      return fn(manager)
    })
  }
}
