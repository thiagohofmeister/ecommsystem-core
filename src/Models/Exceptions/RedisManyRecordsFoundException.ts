import { BadRequestException } from './BadRequestException'

export class RedisManyRecordsFoundException extends BadRequestException {
  constructor(filter: string) {
    super(
      `Many records found with filter ${filter}, try to filter more specifically.`
    )
  }
}
