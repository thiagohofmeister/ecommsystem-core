import { BaseError } from './BaseError'

export class UnauthorizedException extends BaseError {
  constructor(message: string = 'Unauthorized.') {
    super(message)
  }
}
