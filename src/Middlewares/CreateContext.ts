import { Response, NextFunction } from 'express'
import { BadRequestException } from '../Models/Exceptions/BadRequestException'
import { CoreRequest } from '../Models/Request/CoreRequest'

export class CreateContext {
  constructor() {
    this.create = this.create.bind(this)
  }

  public create(request: CoreRequest, response: Response, next: NextFunction) {
    if (!request.header('PLATFORM-STORE-ID')) {
      next(new BadRequestException('Store ID is required.'))
    }

    request.context = {
      storeId: request.header('PLATFORM-STORE-ID')
    }

    next()
  }
}
